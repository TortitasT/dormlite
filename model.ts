import { Database } from "./database.ts";

export class Model {
  static table: Table = {
    name: "model",
    rows: [
      "id SERIAL PRIMARY KEY",
      "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
      "updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
    ],
  } as Table;

  id: number;
  createdAt: string;
  updatedAt: string;

  constructor(
    id: number,
    createdAt: string,
    updatedAt: string,
  ) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
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
}

export interface Table {
  name: string;
  rows: string[];
}
