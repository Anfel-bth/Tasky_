const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: process.env.DB_PASSWORD,
  port: 8000,
});

module.exports = pool;
