const pool = require("../config/db");

function normalizePriority(value) {
  const priority = String(value || "medium").toLowerCase();
  return ["high", "medium", "low"].includes(priority) ? priority : "medium";
}

/**
 * GET /api/tasks?view=today|upcoming
 * Returns all tasks for the authenticated user, each with its category.
 * categories is a SHARED lookup table (category_id, name, color) — tasks
 * reference it via tasks.category_id, not the other way round.
 */
async function getTasks(req, res) {
  const userId = req.user.id;
  const { view } = req.query;

  let dateFilter = "";
  if (view === "today") {
    dateFilter = "AND t.due_date::date = CURRENT_DATE";
  } else if (view === "upcoming") {
    dateFilter = "AND t.due_date::date > CURRENT_DATE";
  }

  try {
    const result = await pool.query(
      `SELECT
         t.task_id, t.title, t.description, t.status, t.priority,
         t.created_at, t.done_at, t.due_date,
         c.category_id, c.name AS category_name, c.color AS category_color
       FROM tasks t
       LEFT JOIN categories c ON c.category_id = t.category_id
       WHERE t.user_id = $1 ${dateFilter}
       ORDER BY
         CASE LOWER(COALESCE(t.priority, 'medium'))
           WHEN 'high' THEN 1
           WHEN 'medium' THEN 2
           ELSE 3
         END,
         t.due_date NULLS LAST,
         t.created_at DESC`,
      [userId],
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("getTasks error:", err);
    res.status(500).json({ message: "Failed to fetch tasks." });
  }
}

/**
 * Looks up a categories row by name. categories is a FIXED lookup table
 * (the six rows: Work, Study, Personal, Shopping, Health, Home) — the
 * app never inserts new rows into it, it only ever matches an existing
 * one and uses its category_id. Returns null if no title/description
 * needed it (name not supplied) or if the name doesn't match any row.
 */
async function findCategory(client, name) {
  if (!name) return null;
  const result = await client.query(
    `SELECT category_id, name, color FROM categories WHERE name = $1`,
    [name],
  );
  return result.rows[0] || null;
}

/**
 * POST /api/tasks
 * Body: { title, description, due_date, category_name, category_color }
 * Looks up (or creates) the category first to get its category_id, then
 * inserts the task pointing at it.
 */
async function createTask(req, res) {
  const userId = req.user.id;
  const { title, description, due_date, category_name, priority } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title is required." });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    let category = null;
    if (category_name) {
      category = await findCategory(client, category_name);
      if (!category) {
        await client.query("ROLLBACK");
        return res
          .status(400)
          .json({ message: `Unknown category: ${category_name}` });
      }
    }

    const taskResult = await client.query(
      `INSERT INTO tasks (title, description, status, created_at, due_date, user_id, category_id, priority)
       VALUES ($1, $2, 'pending', NOW(), $3, $4, $5, $6)
       RETURNING task_id, title, description, status, created_at, due_date, category_id, priority`,
      [
        title,
        description || null,
        due_date || null,
        userId,
        category?.category_id || null,
        normalizePriority(priority),
      ],
    );
    const task = taskResult.rows[0];

    await client.query("COMMIT");
    res.status(201).json({ ...task, category });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("createTask error:", err);
    res.status(500).json({ message: "Failed to create task." });
  } finally {
    client.release();
  }
}

/**
 * PATCH /api/tasks/:id/status
 * Body: { status: 'pending' | 'done' }
 * Toggles status and sets/clears done_at accordingly. Scoped by user_id.
 */
async function updateTaskStatus(req, res) {
  const userId = req.user.id;
  const { id } = req.params;
  const { status } = req.body;

  if (!["pending", "done"].includes(status)) {
    return res
      .status(400)
      .json({ message: "Status must be 'pending' or 'done'." });
  }

  const doneAt = status === "done" ? "NOW()" : "NULL";

  try {
    const result = await pool.query(
      `UPDATE tasks
       SET status = $1, done_at = ${doneAt}
       WHERE task_id = $2 AND user_id = $3
       RETURNING task_id, title, status, done_at`,
      [status, id, userId],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Task not found." });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("updateTaskStatus error:", err);
    res.status(500).json({ message: "Failed to update task status." });
  }
}

/**
 * PATCH /api/tasks/:id
 * Body: any of { title, description, due_date, category_name }
 * Edits task fields and re-points category_id at the matching row in
 * the fixed categories table. Never writes to categories itself —
 * that table only ever holds the six seeded rows.
 */
async function updateTask(req, res) {
  const userId = req.user.id;
  const { id } = req.params;
  const { title, description, due_date, category_name, priority } = req.body;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    let category = null;
    let categoryIdParam = null; // null here means "don't touch category_id"
    if (category_name) {
      category = await findCategory(client, category_name);
      if (!category) {
        await client.query("ROLLBACK");
        return res
          .status(400)
          .json({ message: `Unknown category: ${category_name}` });
      }
      categoryIdParam = category.category_id;
    }

    const taskResult = await client.query(
      `UPDATE tasks
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           due_date = COALESCE($3, due_date),
           category_id = COALESCE($4, category_id),
           priority = COALESCE($5, priority)
       WHERE task_id = $6 AND user_id = $7
       RETURNING task_id, title, description, due_date, category_id, priority`,
      [
        title,
        description,
        due_date,
        categoryIdParam,
        priority ? normalizePriority(priority) : null,
        id,
        userId,
      ],
    );

    if (taskResult.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Task not found." });
    }

    await client.query("COMMIT");
    res.status(200).json({ ...taskResult.rows[0], category });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("updateTask error:", err);
    res.status(500).json({ message: "Failed to update task." });
  } finally {
    client.release();
  }
}

/**
 * DELETE /api/tasks/:id
 * Removes the task. Its category row is left alone — categories is
 * shared, so deleting it here could break every other task pointing at
 * the same category_id.
 */
async function deleteTask(req, res) {
  const userId = req.user.id;
  const { id } = req.params;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Confirm ownership before deleting anything.
    const ownedTask = await client.query(
      `SELECT task_id FROM tasks WHERE task_id = $1 AND user_id = $2`,
      [id, userId],
    );

    if (ownedTask.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Task not found." });
    }

    await client.query(`DELETE FROM tasks WHERE task_id = $1`, [id]);

    await client.query("COMMIT");
    res.status(200).json({ message: "Task deleted." });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("deleteTask error:", err);
    res.status(500).json({ message: "Failed to delete task." });
  } finally {
    client.release();
  }
}

/**
 * GET /api/tasks/stats
 * Overall completion % and per-category counts, scoped by user_id.
 */
async function getStats(req, res) {
  const userId = req.user.id;

  try {
    const overallResult = await pool.query(
      `SELECT
         COUNT(*) AS total,
         COUNT(*) FILTER (WHERE status = 'done') AS completed
       FROM tasks
       WHERE user_id = $1`,
      [userId],
    );
    const { total, completed } = overallResult.rows[0];
    const completionRate =
      total > 0 ? Math.round((completed / total) * 100) : 0;

    const categoryResult = await pool.query(
      `SELECT c.name, COUNT(*) AS count
       FROM categories c
       JOIN tasks t ON t.category_id = c.category_id
       WHERE t.user_id = $1
       GROUP BY c.name
       ORDER BY count DESC`,
      [userId],
    );

    res.status(200).json({
      total: Number(total),
      completed: Number(completed),
      completionRate,
      byCategory: categoryResult.rows.map((r) => ({
        name: r.name,
        count: Number(r.count),
      })),
    });
  } catch (err) {
    console.error("getStats error:", err);
    res.status(500).json({ message: "Failed to fetch stats." });
  }
}

/**
 * GET /api/tasks/counts
 * Numbers for the sidebar badges. They match what each list shows:
 * inbox = every task, today = due today, upcoming = due after today.
 */
async function getCounts(req, res) {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT
         COUNT(*) AS inbox,
         COUNT(*) FILTER (WHERE due_date::date = CURRENT_DATE) AS today,
         COUNT(*) FILTER (WHERE due_date::date > CURRENT_DATE) AS upcoming
       FROM tasks
       WHERE user_id = $1`,
      [userId],
    );
    const r = result.rows[0];
    res.status(200).json({
      inbox: Number(r.inbox),
      today: Number(r.today),
      upcoming: Number(r.upcoming),
    });
  } catch (err) {
    console.error("getCounts error:", err);
    res.status(500).json({ message: "Failed to fetch counts." });
  }
}

module.exports = {
  getTasks,
  createTask,
  updateTaskStatus,
  updateTask,
  deleteTask,
  getStats,
  getCounts,
};
