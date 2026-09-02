const pool = require("../config/db");
const bcrypt = require("bcrypt");

const login = async (req, res) => {
    try {
        // 1. Get email and password from the frontend
        const { email, password } = req.body;
        console.log("Login attempt with email:", email);

        // 2. Check that both fields were provided
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // 3. Find the user in PostgreSQL
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        // 4. Check if the user exists
        if (result.rows.length === 0) {
            console.log("User not found with email:", email);
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const user = result.rows[0];
        console.log("User found. Password in DB starts with:", user.password.substring(0, 10));
        console.log("Password length:", user.password.length);

        // 5. Compare the entered password with the stored password
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        console.log("Password match result:", passwordMatch);

        // 6. Check the password
        if (!passwordMatch) {
            console.log("Password mismatch for user:", email);
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // 7. Login successful
        res.status(200).json({
            message: "Login successful",
            user: {
                user_id: user.user_id,
                user_name: user.user_name,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

module.exports = {
    login
};
