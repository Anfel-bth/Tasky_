const fs = require("node:fs");
const path = require("node:path");
const pool = require("./db");

async function initializeDatabase() {
  const schemaPath = path.join(__dirname, "../../database/schema.sql");
  const schema = fs.readFileSync(schemaPath, "utf8");
  await pool.query(schema);
}

module.exports = initializeDatabase;
