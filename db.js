const { Client } = require("pg");

const DB_URI = process.env.NODE_ENV === "test"
    ? "postgresql:///friendster_test"
    : "postgresql:///friendster";

let db = new Client({
  connectionString: DB_URI
});

db.connect();

module.exports = db;