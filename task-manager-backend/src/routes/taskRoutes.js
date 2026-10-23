const express = require("express");
const router = express.Router();
const {
  getTasks,
  createTask,
  updateTaskStatus,
  updateTask,
  deleteTask,
  getStats,
  getCounts,
} = require("../controllers/taskController");

// Mounted in server.js as: app.use("/api/tasks", verifyToken, taskRoutes);
// so req.user is already set by the time any handler here runs.

router.get("/", getTasks);
router.get("/stats", getStats);
router.get("/counts", getCounts);
router.post("/", createTask);
router.patch("/:id/status", updateTaskStatus);
router.patch("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;
