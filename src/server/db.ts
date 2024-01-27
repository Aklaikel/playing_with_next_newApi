import { Database } from "sqlite3";

console.log("Called");

const connection = new Database("./db.sqlite", (err) => {
  if (err) throw err;
  console.log("Connected to the database.");
});

connection.run(
  `CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT not null, description TEXT not null)`,
  (err) => {
    if (err) throw err;
    console.log("Created the todos table.");
  }
);

export const db = connection;
