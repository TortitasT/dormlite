import { DB } from "https://deno.land/x/sqlite@v3.7.0/mod.ts";
import { Model, Table } from "./model.ts";

export class Database {
  static db: DB;

  static async init(models: any[]) {
    this.db = new DB("database.db");

    if (!await Deno.stat("./database.db")) {
      await models.forEach(async (model) => {
        await model.init();
      });
    }
  }
}

await Database.init(
  [
    class User extends Model {
      static table: Table = {
        name: "users",
        rows: [
          "id SERIAL PRIMARY KEY",
          "name TEXT NOT NULL",
          "email TEXT NOT NULL",
          "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
          "updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        ],
      } as Table;

      name: string;
      email: string;

      constructor(
        id: number,
        createdAt: string,
        updatedAt: string,
        name: string,
        email: string,
      ) {
        super(id, createdAt, updatedAt);
        this.name = name;
        this.email = email;
      }
    },
  ],
);

console.log(
  await Database.db.query(
    `
    SELECT * FROM users
  `,
  ),
);
