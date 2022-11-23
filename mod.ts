import { DB } from "https://deno.land/x/sqlite@v3.7.0/mod.ts";

export class Database {
  static db: DB;

  // deno-lint-ignore no-explicit-any
  static async init(filename: string, models: any[]) {
    const databaseExists = await Deno.stat(`${filename}.db`).catch(() => false);

    this.db = new DB(`${filename}.db`);

    if (!databaseExists) {
      await models.forEach(async (model) => {
        await model.init();
      });
    }
  }
}

export class Model {
  static table: any = {
    name: "model",
    autoincrement: 0,
    rows: [
      "id SERIAL PRIMARY KEY",
      "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
      "updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
    ],
  };

  id: number;
  created_at: string;
  updated_at: string;

  constructor() {
    this.id = getAutoincrement(this);
    this.created_at = new Date().toISOString();
    this.updated_at = new Date().toISOString();
  }

  static async init() {
    await Database.db.query(
      `
      CREATE TABLE IF NOT EXISTS ${this.table.name} (
        ${this.table.rows.join(", ")}
      )
      `,
    );
  }

  static async all(): Promise<Model[]> {
    const results = await Database.db.query(
      `SELECT * FROM ${this.table.name}`,
    );

    return results as unknown[] as Model[];
  }

  static async find(id: number): Promise<Model> {
    const results = await Database.db.query(
      `SELECT * FROM ${this.table.name} WHERE id = $1`,
      [id],
    );

    return results[0] as unknown as Model;
  }

  static async where(
    column: string,
    value: string | number,
  ): Promise<Model[]> {
    const results = await Database.db.query(
      `SELECT * FROM ${this.table.name} WHERE ${column} = $1`,
      [value],
    );

    return results as unknown[] as Model[];
  }

  static async create(
    model: Model,
  ): Promise<Model> {
    const columns = Object.keys(model);
    const values = Object.values(model);

    const result = await Database.db.query(
      `INSERT INTO ${this.table.name} (${columns.join(", ")}) VALUES (${
        values.map((_, i) => `$${i + 1}`).join(", ")
      }) RETURNING *`,
      values,
    );

    return result[0] as unknown as Model;
  }
}

export interface Table {
  name: string;
  rows: string[];
}

// Source: https://stackoverflow.com/questions/33387318/access-to-static-properties-via-this-constructor-in-typescript
function getAutoincrement<T>(target: T) {
  type Type = {
    constructor: Type;
    table: any;
  } & T;

  return (target as Type).constructor.table.autoincrement++;
}
