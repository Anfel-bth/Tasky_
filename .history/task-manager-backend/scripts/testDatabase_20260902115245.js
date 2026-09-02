require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function testConnection() {
  try {
    console.log("\n🔍 Testing Database Connection...");
    console.log("=====================================");
    console.log("Host:", process.env.DB_HOST);
    console.log("Port:", process.env.DB_PORT);
    console.log("Database:", process.env.DB_NAME);
    console.log("User:", process.env.DB_USER);
    console.log("=====================================\n");

    const result = await pool.query("SELECT NOW()");
    console.log("✅ Database connection successful!");
    console.log("Current time:", result.rows[0]);

    // Check if users table exists
    const tableCheck = await pool.query(
      "SELECT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name='users')",
    );
    console.log("\nUsers table exists:", tableCheck.rows[0].exists);

    if (tableCheck.rows[0].exists) {
      const userCount = await pool.query("SELECT COUNT(*) FROM users");
      console.log("Number of users in database:", userCount.rows[0].count);

      const users = await pool.query(
        "SELECT user_id, email, user_name FROM users",
      );
      console.log("\nUsers in database:");
      users.rows.forEach((user) => {
        console.log(
          ` - ID: ${user.user_id}, Email: ${user.email}, Name: ${user.user_name}`,
        );
      });
    }

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Database connection failed!");
    console.error("Error:", error.message);
    console.error("\nCommon issues:");
    console.log("1. PostgreSQL is not running");
    console.log("2. Port number is incorrect (check your .env file)");
    console.log("3. Database name, user, or password is incorrect");
    console.log("4. Database doesn't exist");
    await pool.end();
    process.exit(1);
  }
}

testConnection();
