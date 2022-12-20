# Deno Orm sqLite

An sqlite orm library on Deno for my personal projects. Depends on [sqlite@v3.7.0](https://deno.land/x/sqlite@v3.7.0).

## Import

```ts
import { Database } from "https://deno.land/x/dormlite/mod.ts";
```

## Usage

Usage is covered on [the tests](./mod.test.ts). You can run them with 
```bash
deno test --allow-read --allow-write
```

Quick example:

```ts
import { Database } from "https://deno.land/x/dormlite/mod.ts";

class User extends Model {
  static tableName = "users"; // Table name

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

await Database.init(
  "test", // Database file name
  [User]
);

const user = new User("John Doe", "john@doe.es");

await User.create(user);

console.log(await User.all()); // [User { id: 1, name: "John Doe", email: "john@doe.es" }]

Database.db.close();
Deno.removeSync("test.sqlite");
```
