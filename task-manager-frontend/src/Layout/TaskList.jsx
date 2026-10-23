// src/Layout/TaskList.jsx
import { useCallback, useEffect, useState } from "react";
import TaskDetail from "./TaskDetail.jsx";

/**
 * Task list card (same design as the "Today" card):
 *   - header with the list title + "X of Y done" badge
 *   - one row per task: checkbox, title (struck through when done),
 *     description underneath, category pill on the right
 *
 * Usage:
 *   <TaskList title="Inbox" />                  // all tasks
 *   <TaskList title="Today" view="today" />     // GET /api/tasks?view=today
 *   <TaskList title="Upcoming" view="upcoming" />
 *
 * It re-fetches whenever AddTaskModal creates a task (it dispatches a
 * "tasks:changed" window event), so the new task shows up right away.
 */

const API_BASE = "/api/tasks";
const TOKEN_KEY = "token"; // same key as in AddTaskModal.jsx

// Pill colours per category name (only used for display).
const CATEGORY_STYLES = {
  Work: { text: "text-[#5F8F56]", bg: "bg-[#E9F3E7]" },
  Study: { text: "text-[#B9934A]", bg: "bg-[#FCF4E7]" },
  Personal: { text: "text-[#877CAA]", bg: "bg-[#F2F0F9]" },
  Shopping: { text: "text-[#B96E5A]", bg: "bg-[#FCEDEA]" },
  Health: { text: "text-[#AE6F6F]", bg: "bg-[#F9EEEE]" },
  Home: { text: "text-[#728C9D]", bg: "bg-[#EEF3F6]" },
};
const FALLBACK_STYLE = { text: "text-[#8A8D99]", bg: "bg-[#F7F6F2]" };

const PRIORITY_STYLES = {
  high: { label: "High", text: "text-[#C1583A]", bg: "bg-[#FBEBE6]" },
  medium: { label: "Medium", text: "text-[#C98A2E]", bg: "bg-[#FCF1DF]" },
  low: { label: "Low", text: "text-[#6B9463]", bg: "bg-[#EAF2E7]" },
};
const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

function sortByPriority(list) {
  return [...list].sort((a, b) => {
    const aRank = PRIORITY_ORDER[String(a.priority || "medium").toLowerCase()] ?? 1;
    const bRank = PRIORITY_ORDER[String(b.priority || "medium").toLowerCase()] ?? 1;
    return aRank - bRank;
  });
}

function dueKey(due) {
  if (!due) return null;
  const key = String(due).slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(key) ? key : null;
}

function todayKey() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDayTitle(key) {
  if (!key) return "No date";
  const [y, m, d] = key.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const today = todayKey();
  const [ty, tm, td] = today.split("-").map(Number);
  const diff = Math.round(
    (date - new Date(ty, tm - 1, td)) / (1000 * 60 * 60 * 24),
  );

  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff === -1) return "Yesterday";

  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

function groupTasksByDay(tasks) {
  const buckets = new Map();
  for (const task of tasks) {
    const key = dueKey(task.due_date) || "none";
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(task);
  }

  const today = todayKey();
  const dated = [...buckets.keys()].filter((key) => key !== "none");
  dated.sort((a, b) => {
    const aPast = a < today;
    const bPast = b < today;
    if (aPast !== bPast) return aPast ? -1 : 1;
    if (aPast && bPast) return b.localeCompare(a);
    return a.localeCompare(b);
  });

  const groups = dated.map((key) => ({
    key,
    title: formatDayTitle(key),
    overdue: key < today,
    tasks: sortByPriority(buckets.get(key)),
  }));

  if (buckets.has("none")) {
    groups.push({
      key: "none",
      title: "No date",
      overdue: false,
      tasks: sortByPriority(buckets.get("none")),
    });
  }

  return groups;
}

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
  };
}

// due_date can come back as "2026-10-21" or a full ISO timestamp. Reading
// only the date part avoids the timezone shifting it by a day.
function formatDue(due) {
  if (!due) return "";
  const [y, m, d] = String(due).slice(0, 10).split("-").map(Number);
  if (!y || !m || !d) return "";
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function TaskList({ title = "Inbox", view, groupByDay = false }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);

  const loadTasks = useCallback(async () => {
    try {
      const url = view ? `${API_BASE}?view=${view}` : API_BASE;
      const res = await fetch(url, { headers: authHeaders() });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(
          body.message || `Failed to load tasks (${res.status}).`,
        );
      }
      setTasks(sortByPriority(await res.json()));
      setError("");
    } catch (err) {
      setError(err.message || "Couldn't load tasks.");
    } finally {
      setLoading(false);
    }
  }, [view]);

  useEffect(() => {
    loadTasks();
    window.addEventListener("tasks:changed", loadTasks);
    return () => window.removeEventListener("tasks:changed", loadTasks);
  }, [loadTasks]);

  async function deleteTask(task) {
    const previous = tasks;
    setTasks((prev) =>
      sortByPriority(prev.filter((t) => t.task_id !== task.task_id)),
    );
    setSelectedTask((current) =>
      current?.task_id === task.task_id ? null : current,
    );

    try {
      const res = await fetch(`${API_BASE}/${task.task_id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error();
      window.dispatchEvent(new Event("tasks:changed"));
    } catch {
      setTasks(previous);
      setError("Couldn't delete that task. Try again.");
    }
  }

  async function toggleTask(task) {
    const nextStatus = task.status === "done" ? "pending" : "done";

    // Optimistic update: flip it immediately, undo if the server refuses.
    const updated = { ...task, status: nextStatus };
    setTasks((prev) =>
      sortByPriority(
        prev.map((t) => (t.task_id === task.task_id ? updated : t)),
      ),
    );
    setSelectedTask((current) =>
      current?.task_id === task.task_id ? updated : current,
    );

    try {
      const res = await fetch(`${API_BASE}/${task.task_id}/status`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!res.ok) throw new Error();
      window.dispatchEvent(new Event("tasks:changed"));
    } catch {
      setTasks((prev) =>
        prev.map((t) =>
          t.task_id === task.task_id ? { ...t, status: task.status } : t,
        ),
      );
      setSelectedTask((current) =>
        current?.task_id === task.task_id ? task : current,
      );
      setError("Couldn't update that task. Try again.");
    }
  }

  const groups = groupByDay ? groupTasksByDay(tasks) : null;

  function renderStatus() {
    if (error) {
      return (
        <div
          role="alert"
          className="text-[12.5px] font-semibold text-[#C1583A] bg-[#FBEBE6] rounded-[10px] px-3 py-2"
        >
          {error}
        </div>
      );
    }
    if (loading) {
      return <p className="py-2 text-[13.5px] text-[#8A8D99]">Loading tasks…</p>;
    }
    if (tasks.length === 0) {
      return (
        <p className="py-2 text-[13.5px] text-[#8A8D99]">
          No tasks yet. Click “Add task” to create your first one.
        </p>
      );
    }
    return null;
  }

  const status = renderStatus();

  return (
    <>
      {groupByDay ? (
        <div className="flex flex-col gap-4">
          {status && (
            <div className="bg-white border border-[#EAE8E2] rounded-[18px] px-5 py-4 text-[#474A57] shadow-[0_1px_2px_rgba(40,38,30,.04),0_6px_20px_rgba(40,38,30,.05)]">
              <h2 className="text-[16px] font-bold pb-2">Inbox</h2>
              {status}
            </div>
          )}
          {!status &&
            groups.map((group) => (
              <DayCard
                key={group.key}
                title={group.title}
                overdue={group.overdue}
                tasks={group.tasks}
                hideDueDate
                onToggle={toggleTask}
                onDelete={deleteTask}
                onOpen={setSelectedTask}
              />
            ))}
        </div>
      ) : (
        <DayCard
          title={title}
          tasks={tasks}
          status={status}
          onToggle={toggleTask}
          onDelete={deleteTask}
          onOpen={setSelectedTask}
        />
      )}

      {selectedTask && (
        <TaskDetail
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onToggle={toggleTask}
          onDelete={deleteTask}
        />
      )}
    </>
  );
}

function DayCard({
  title,
  tasks,
  overdue = false,
  hideDueDate = false,
  status = null,
  onToggle,
  onDelete,
  onOpen,
}) {
  const doneCount = tasks.filter((t) => t.status === "done").length;

  return (
    <div className="bg-white border border-[#EAE8E2] rounded-[18px] px-5 py-4 text-[#474A57] shadow-[0_1px_2px_rgba(40,38,30,.04),0_6px_20px_rgba(40,38,30,.05)]">
      <div className="flex items-center justify-between pb-3.5 border-b border-[#EAE8E2]">
        <div className="flex items-center gap-2 min-w-0">
          <h2 className="text-[16px] font-bold truncate">{title}</h2>
          {overdue && (
            <span className="text-[11px] font-bold text-[#C1583A] bg-[#FBEBE6] rounded-full px-2.5 py-0.5">
              Overdue
            </span>
          )}
        </div>
        {tasks.length > 0 && (
          <span className="text-[12px] font-bold text-[#6B9463] bg-[#EAF2E7] rounded-full px-3 py-1">
            {doneCount} of {tasks.length} done
          </span>
        )}
      </div>

      {status ? (
        <div className="mt-3">{status}</div>
      ) : (
        <ul>
          {tasks.map((task) => {
            const done = task.status === "done";
            const style = CATEGORY_STYLES[task.category_name] || FALLBACK_STYLE;
            const due = hideDueDate ? "" : formatDue(task.due_date);
            const subtitle = [task.description, due]
              .filter(Boolean)
              .join(" · ");
            const priority =
              PRIORITY_STYLES[String(task.priority || "medium").toLowerCase()] ||
              PRIORITY_STYLES.medium;

            return (
              <li
                key={task.task_id}
                className="flex items-center gap-3 py-3.5 border-b border-[#EAE8E2] last:border-b-0"
              >
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={done}
                  aria-label={`Mark "${task.title}" as ${done ? "not done" : "done"}`}
                  onClick={() => onToggle(task)}
                  className={`w-[18px] h-[18px] shrink-0 rounded-[5px] border flex items-center justify-center transition-colors ${
                    done
                      ? "bg-[#8CAF82] border-[#8CAF82]"
                      : "bg-white border-[#B7B9C2] hover:border-[#8CAF82]"
                  }`}
                >
                  {done && (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="3.2"
                      className="w-3 h-3"
                    >
                      <path
                        d="M5 12.5l4.5 4.5L19 7.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => onOpen(task)}
                  className="flex-1 min-w-0 text-left rounded-[8px] px-1 -mx-1 hover:bg-[#F7F6F2] transition-colors"
                >
                  <p
                    className={`text-[14px] font-bold truncate ${
                      done ? "line-through text-[#B7B9C2]" : "text-[#474A57]"
                    }`}
                  >
                    {task.title}
                  </p>
                  {subtitle && (
                    <p className="text-[12.5px] text-[#8A8D99] truncate">
                      {subtitle}
                    </p>
                  )}
                </button>

                <span
                  className={`shrink-0 text-[12px] font-bold rounded-full px-3 py-1 ${priority.bg} ${priority.text}`}
                >
                  {priority.label}
                </span>

                {task.category_name && (
                  <button
                    type="button"
                    onClick={() => onOpen(task)}
                    className={`shrink-0 text-[12px] font-bold rounded-full px-3 py-1 ${style.bg} ${style.text}`}
                  >
                    {task.category_name}
                  </button>
                )}

                <button
                  type="button"
                  aria-label={`Delete "${task.title}"`}
                  onClick={() => onDelete(task)}
                  className="shrink-0 w-8 h-8 rounded-[8px] flex items-center justify-center text-[#B7B9C2] hover:text-[#C1583A] hover:bg-[#FBEBE6] transition-colors"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-4 h-4"
                  >
                    <path
                      d="M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2M6 7l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12M10 11v6M14 11v6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default TaskList;
