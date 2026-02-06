# Database

### Disclaimer

We use duckdb as our database. It even is hosted by the NodeJS extension to run in the same process.
These are already multiple decisions on my part that are BAD for performance, scalability and security.

But in turn we receive a very simple setup for using the database, which is enough for this project.
This also allows us to store the database in one simple file under `/var/database.duckdb` that can easily be
accessed by the duckdb client for debugging.

Also, I just wanted to use duckdb for once... One has to know alternatives to MySql, MariaDB, SQLite, Postgres and
MongoDB (for NoSQL)

### How to use

The database singleton with the defined helper classes allow for a very simple database access, alltough requiring pure
SQL.
You can just access the methods of the database singleton (which you can import) and pass

- The expected column types as a typed tuple in the generic parameter for queries
- The SQL Expression as a string

```typescript
// query data (mostly relevant for SELECT queries)
const result = await database.query<[number]>("SELECT id FROM examples");

// execute a statement (prefer this over query if possible)
await database.execute("INSERT INTO examples VALUES (1, 2, 3)");
```

To pass values to the database securely, you should bind them instead of inserting them into the string.
This can easily be done by passing a matching object with values and optionally a matching object with
DuckDB types to the methods:

```typescript
// pass values for binding them
await database.execute("INSERT INTO examples VALUES ($a, $b, $c)", {
    a: 1,
    b: 2,
    c: 3.0,
});

// also define the datatypes to prevent ambiguity, false conversion and get more data safety
await database.execute("INSERT INTO examples VALUES ($a, $b, $c)", {
    a: 1,
    b: 2,
    c: 3.0,
}, {
    a: INTEGER,
    b: INTEGER,
    c: FLOAT,
});
```

### Changes to the database schema

If you want to change the schema of the database or do a one-time upgrade of old data,
create a new Migration file in the [migration directory](migrations). Every migration consists
of one `.sql` file. The filename has to be `Migration_year_month_day-_hour_minute.sql`, because they are executed in
this order
from oldest to newest.

Inside one of these SQL files, you can do multiple queries, but they should always end with a semicolon.
Never change older migration files, as that can break the assumptions made by following migrations. Instead, add your
own migration
to alter the tables and data.

Whenever you add, remove or update a table, please adjust the [name constant and schema type](Tables.ts) as well.