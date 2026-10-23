const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendOtpEmail = require("../config/mailer");
const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const login = async (req, res) => {
  try {
    // 1. Get email and password from the frontend
    const { email, password } = req.body;
    console.log("Login attempt with email:", email);

    // 2. Check that both fields were provided
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // 3. Find the user in PostgreSQL
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    // 4. Check if the user exists
    if (result.rows.length === 0) {
      console.log("User not found with email:", email);
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const user = result.rows[0];
    console.log(
      "User found. Password in DB starts with:",
      user.password.substring(0, 10),
    );
    console.log("Password length:", user.password.length);

    // 5. Compare the entered password with the stored password
    const passwordMatch = await bcrypt.compare(password, user.password);

    console.log("Password match result:", passwordMatch);

    // 6. Check the password
    if (!passwordMatch) {
      console.log("Password mismatch for user:", email);
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // 7. Block login until the account has been verified
    if (!user.is_verified) {
      console.log("Login blocked - unverified account:", email);
      return res.status(403).json({
        message: "Please verify your email before logging in.",
        email: user.email,
      });
    }

    // 8. Issue a JWT, same shape as verifyOtp
    const token = jwt.sign(
      { id: user.user_id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    // 9. Login successful
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        user_id: user.user_id,
        user_name: user.user_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// REGISTER
const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const existing = await pool.query(
      "SELECT user_id, is_verified FROM users WHERE email = $1",
      [email],
    );

    if (existing.rows.length > 0 && existing.rows[0].is_verified) {
      return res.status(409).json({ message: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    if (existing.rows.length > 0 && !existing.rows[0].is_verified) {
      // Unverified account already exists -> update it instead of duplicating
      await pool.query(
        `UPDATE users
         SET user_name = $1, password = $2, otp_code = $3, otp_expires = $4, role = $5
         WHERE email = $6`,
        [name, hashedPassword, otp, otpExpires, role || "user", email],
      );
    } else {
      await pool.query(
        `INSERT INTO users (user_name, email, password, otp_code, otp_expires, role, is_verified)
         VALUES ($1, $2, $3, $4, $5, $6, FALSE)`,
        [name, email, hashedPassword, otp, otpExpires, role || "user"],
      );
    }

    await sendOtpEmail(email, otp);

    res.status(201).json({ message: "OTP sent to email.", email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};

// VERIFY OTP
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = result.rows[0];

    if (!user) return res.status(404).json({ message: "User not found." });
    if (user.is_verified)
      return res.status(400).json({ message: "Already verified." });
    if (user.otp_code !== otp)
      return res.status(400).json({ message: "Invalid OTP." });
    if (new Date() > new Date(user.otp_expires)) {
      return res.status(400).json({ message: "OTP expired." });
    }

    await pool.query(
      `UPDATE users SET is_verified = TRUE, otp_code = NULL, otp_expires = NULL WHERE email = $1`,
      [email],
    );

    const token = jwt.sign(
      { id: user.user_id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.status(200).json({
      message: "Account verified.",
      token,
      user: {
        id: user.user_id,
        name: user.user_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};

// RESEND OTP
const resendOtp = async (req, res) => {
  const { email } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = result.rows[0];
    if (!user) return res.status(404).json({ message: "User not found." });
    if (user.is_verified)
      return res.status(400).json({ message: "Already verified." });

    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    await pool.query(
      "UPDATE users SET otp_code = $1, otp_expires = $2 WHERE email = $3",
      [otp, otpExpires, email],
    );

    await sendOtpEmail(email, otp);
    res.status(200).json({ message: "OTP resent." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};

const logout = async (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
};

module.exports = { register, verifyOtp, resendOtp, login, logout };

// module.exports = {
//   login,
// };
