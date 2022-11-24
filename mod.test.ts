import { assertEquals } from "https://deno.land/std@0.165.0/testing/asserts.ts";

import { Database, Model } from "./mod.ts";

class Dinosaur extends Model {
  static tableName = "dinosaurs";

  name: string;
  coolness: number;

  constructor(
    name: string,
    coolness: number,
  ) {
    super();
    this.name = name;
    this.coolness = coolness;
  }
}

class User extends Model {
  static tableName = "users";

  name: string;
  email: string;

  constructor(
    name: string,
    email: string,
  ) {
    super();
    this.name = name;
    this.email = email;
  }
}

Deno.test("Create models", async () => {
  await Database.init(
    "test",
    [
      Dinosaur,
      User,
    ],
  );

  const user = new User("John Doe", "john@doe.es");
  const user2 = new User("John Doe", "john@eod.es");

  await User.create(user);
  await User.create(user2);

  const users = await User.all();

  assertEquals(users.length, 2);

  Database.db.close();
  Deno.removeSync("./test.db", { recursive: true });
});
