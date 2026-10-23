require("dotenv").config();
const pool = require("../src/config/db");

async function testConnection() {
  try {
    console.log("\n🔍 Testing Database Connection...");
    console.log("=====================================");
    const result = await pool.query("SELECT NOW()");
    console.log("✅ Database connection successful!");
    console.log("Current time:", result.rows[0]);

    const tableCheck = await pool.query(
      "SELECT to_regclass('public.users') IS NOT NULL AS exists",
    );
    console.log("\nUsers table exists:", tableCheck.rows[0].exists);

    if (tableCheck.rows[0].exists) {
      const userCount = await pool.query("SELECT COUNT(*) FROM users");
      console.log("Number of users in database:", userCount.rows[0].count);
    }

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Database connection failed!");
    console.error("Error:", error.message);
    await pool.end();
    process.exit(1);
  }
}

testConnection();
