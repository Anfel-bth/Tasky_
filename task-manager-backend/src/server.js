require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
const initializeDatabase = require("./config/initializeDatabase");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const verifyToken = require("./middleware/verifyToken");

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Origin not allowed by CORS: ${origin}`));
    },
  }),
);
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.json({
    message: "Tasky API is running!",
  });
});

app.get("/api/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      message: "Database connected!",
      time: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Database connection failed",
    });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", verifyToken, taskRoutes);

async function startServer() {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is required.");
  }

  await initializeDatabase();

  app.listen(PORT, () => {
    console.log(`Tasky server listening on port ${PORT}`);
  });
}

startServer().catch(async (error) => {
  console.error("Failed to start Tasky API:", error);
  await pool.end();
  process.exitCode = 1;
});
