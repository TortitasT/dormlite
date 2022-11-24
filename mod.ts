import { DB } from "https://deno.land/x/sqlite@v3.7.0/mod.ts";

export class Database {
  static db: DB;

  // deno-lint-ignore no-explicit-any
  static async init(filename: string, models: any[]) {
    const databaseExists = await Deno.stat(`${filename}.db`).catch(() => false);

    this.db = new DB(`${filename}.db`);

    if (!databaseExists) {
      await models.forEach(async (model) => {
        await model.init(model);
      });
    }
  }
}

export class Model {
  static autoincrement = 0;
  static tableName = "models";

  id: number;
  created_at: string;
  updated_at: string;

  constructor() {
    this.id = getAutoincrement(this);
    this.created_at = new Date().toISOString();
    this.updated_at = new Date().toISOString();
  }

  static async init<T extends Model>(model: new () => T) {
    const temp: any = new model();

    const columns = Object.keys(temp).map((column) => {
      if (column === "id") {
        return `${column} SERIAL PRIMARY KEY`;
      } else if (column === "tableName") {
        return false;
      }

      const type = typeof temp[column];
      let sqlType = "";

      switch (type) {
        case "string":
          sqlType = "TEXT";
          break;
        case "number":
          sqlType = "INT";
          break;
        case "boolean":
          sqlType = "BOOLEAN";
          break;
        default:
          sqlType = "TEXT";
      }

      return `${column} ${sqlType}`;
    }).filter(Boolean);

    await Database.db.query(
      `
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        ${columns.join(", ")}
      )
      `,
    );
  }

  static async all(): Promise<Model[]> {
    const results = await Database.db.query(
      `SELECT * FROM ${this.tableName}`,
    );

    return results as unknown[] as Model[];
  }

  static async find(id: number): Promise<Model> {
    const results = await Database.db.query(
      `SELECT * FROM ${this.tableName} WHERE id = $1`,
      [id],
    );

    return results[0] as unknown as Model;
  }

  static async where(
    column: string,
    value: string | number,
  ): Promise<Model[]> {
    const results = await Database.db.query(
      `SELECT * FROM ${this.tableName} WHERE ${column} = $1`,
      [value],
    );

    return results as unknown[] as Model[];
  }

  static async create(
    model: Model,
  ): Promise<Model> {
    const columns = Object.keys(model);
    const values = Object.values(model);

    const indexOfTableName = columns.indexOf("tableName");
    if (indexOfTableName! > -1) {
      columns.splice(indexOfTableName, 1);
      values.splice(indexOfTableName, 1);
    }

    const result = await Database.db.query(
      `INSERT INTO ${this.tableName} (${columns.join(", ")}) VALUES (${
        values.map((_, i) => `$${i + 1}`).join(", ")
      }) RETURNING *`,
      values,
    );

    return result[0] as unknown as Model;
  }

  static async clear(): Promise<void> {
    await Database.db.query(
      `DELETE FROM ${this.tableName}`,
    );
  }
}

// Source: https://stackoverflow.com/questions/33387318/access-to-static-properties-via-this-constructor-in-typescript
function getAutoincrement<T>(target: T) {
  type Type = {
    constructor: Type;
    autoincrement: any;
  } & T;

  return (target as Type).constructor.autoincrement++;
}
