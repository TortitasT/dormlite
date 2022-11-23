# Deno Orm sqLite

An sqlite orm for Deno.

# Usage
```typescript
import { Database } from '';

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
```
