const bcrypt = require("bcrypt");
const pool = require("../src/config/db");

const updatePassword = async (email, plainPassword) => {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    console.log("Hashed password:", hashedPassword);

    // Update the database
    const result = await pool.query(
      "UPDATE users SET password = $1 WHERE email = $2 RETURNING *",
      [hashedPassword, email],
    );

    if (result.rows.length === 0) {
      console.log("User not found with email:", email);
      return;
    }

    console.log("Password updated successfully for user:", email);
    console.log("Updated user:", result.rows[0]);
    process.exit(0);
  } catch (error) {
    console.error("Error updating password:", error);
    process.exit(1);
  }
};

// Get email and password from command line arguments
const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.log("Usage: node scripts/hashPassword.js <email> <password>");
  console.log(
    "Example: node scripts/hashPassword.js user@example.com mypassword",
  );
  process.exit(1);
}

updatePassword(email, password);
