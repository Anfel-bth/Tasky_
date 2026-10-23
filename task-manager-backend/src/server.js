require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const verifyToken = require("./middleware/verifyToken");

const app = express();

app.use(cors());
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

async function ensurePriorityColumn() {
  await pool.query(`
    ALTER TABLE tasks
    ADD COLUMN IF NOT EXISTS priority VARCHAR(10) DEFAULT 'medium'
  `);
}

app.listen(PORT, async () => {
  try {
    await ensurePriorityColumn();
  } catch (err) {
    console.error("Failed to ensure tasks.priority column:", err.message);
  }
  console.log(`Tasky server running on http://localhost:${PORT}`);
});
