// src/Layout/AddTaskModal.jsx
import { useEffect, useRef, useState } from "react";

/**
 * Add-task form, styled off the same Tasky design-system tokens as
 * Sidebar.jsx (exact hex values via Tailwind arbitrary values), so the
 * two feel like one continuous surface:
 *   sage        #8CAF82  (hover #6B9463, tint #EAF2E7)
 *   coral       #E8836C  (tint #FBEBE6)
 *   peach       #F0B860  (tint #FCF1DF)
 *   lavender    #B4A7D6  (tint #F1EEF8)
 *   ink         #474A57  (soft #8A8D99, faint #B7B9C2)
 *   border      #EAE8E2
 *   warm bg     #F7F6F2
 *
 * Fields: title, category, date, time, priority, description (optional).
 * Categories: 💼 Work #8FB486 · 📚 Study #E8B85C · 👤 Personal #A99BD5 ·
 *             🛒 Shopping #E88970 · ❤️ Health #D98B8B · 🏠 Home #8FAFC4
 * Priority: Low (sage) · Medium (peach) · High (coral)
 *
 * What changed from the previous version, and why:
 * - Selection state for category/priority used two signals at once
 *   (faded opacity + a ring). Collapsed to one signal: selected = filled
 *   tint + colored text, unselected = plain white + a hairline border.
 *   Easier to scan, same colors.
 * - Description moved to the end and marked "optional" — it's the one
 *   field nobody's blocked on, so it shouldn't compete with title/date/
 *   priority for attention up top.
 * - Date & time promoted above priority, since "when" is usually decided
 *   before "how urgent," and it keeps the two schedule fields together
 *   right after category.
 * - Modal now closes on Escape and on backdrop click, and the title
 *   error clears as soon as the person starts typing again — small
 *   things that make it feel less like a form you can get "stuck" in.
 * - Added dialog semantics (role, aria-modal, aria-labelledby) and
 *   aria-pressed on the toggle buttons for screen readers.
 *
 * Render <AddTaskModal open={...} onClose={...} onSubmit={...} />
 * from wherever "Add task" is triggered (e.g. Sidebar's button).
 * (open/onClose default to internal state when omitted, so this file
 * also previews standalone.)
 *
 * --- Wired to POST /api/tasks (taskController.createTask) ---
 * The controller reads { title, description, due_date, category_name }
 * off req.body — categories is a FIXED lookup table (Work, Study,
 * Personal, Shopping, Health, Home, each with its own color already set
 * in the DB), so this form only ever sends the category's name. The
 * server looks up category_id (and color) by that name; it rejects
 * anything that isn't one of the six existing rows rather than create
 * a new one. A few other things worth knowing about the mapping:
 *
 * - due_date: the table only has one due_date column, no separate time
 *   column. If both date and time are set, this form combines them into
 *   a single `YYYY-MM-DDTHH:mm:00` string; if only date is set, it sends
 *   just the date. Adjust `buildDueDate` below if your due_date column
 *   is a plain DATE and can't take a timestamp.
 * - priority: createTask doesn't destructure or store a priority field
 *   at all yet. It's still sent in the request body (harmless — Express
 *   just ignores unknown keys) but it will NOT be persisted until a
 *   priority column and insert are added server-side. Flagging this so
 *   it doesn't look like a silent bug later.
 * - auth: verifyToken reads the JWT from the Authorization header, so
 *   this sends `Authorization: Bearer <token>`, with the token read from
 *   localStorage under TOKEN_KEY (set near the top of this file).
 * - API_BASE: relative "/api/tasks" relies on the Vite dev proxy
 *   (server.proxy "/api" -> http://localhost:5000 in vite.config.js).
 */

const API_BASE = "/api/tasks";

// The localStorage key your login code saves the JWT under. Check
// DevTools → Application → Local Storage and change this if yours differs.
const TOKEN_KEY = "token";

// The `color`/`text`/`bg` values below are only for this form's own
// on-screen styling (the pill buttons) — they're never sent to the
// server. The server already has each category's color stored against
// its name in the categories table.
const CATEGORIES = [
  {
    id: "work",
    icon: "💼",
    label: "Work",
    text: "text-[#5F8F56]",
    bg: "bg-[#E9F3E7]",
  },
  {
    id: "study",
    icon: "📚",
    label: "Study",
    text: "text-[#B9934A]",
    bg: "bg-[#FCF4E7]",
  },
  {
    id: "personal",
    icon: "👤",
    label: "Personal",
    text: "text-[#877CAA]",
    bg: "bg-[#F2F0F9]",
  },
  {
    id: "shopping",
    icon: "🛒",
    label: "Shopping",
    text: "text-[#B96E5A]",
    bg: "bg-[#FCEDEA]",
  },
  {
    id: "health",
    icon: "❤️",
    label: "Health",
    text: "text-[#AE6F6F]",
    bg: "bg-[#F9EEEE]",
  },
  {
    id: "home",
    icon: "🏠",
    label: "Home",
    text: "text-[#728C9D]",
    bg: "bg-[#EEF3F6]",
  },
];

// Combines the date + time inputs into one due_date value for the API.
// Falls back to date-only, or null if neither is set.
function buildDueDate(date, time) {
  if (!date) return null;
  return time ? `${date}T${time}:00` : date;
}

const PRIORITIES = [
  { id: "low", label: "Low", text: "text-[#6B9463]", bg: "bg-[#EAF2E7]" },
  { id: "medium", label: "Medium", text: "text-[#C98A2E]", bg: "bg-[#FCF1DF]" },
  { id: "high", label: "High", text: "text-[#C1583A]", bg: "bg-[#FBEBE6]" },
];

const inputClass =
  "w-full bg-[#F7F6F2] border border-[#EAE8E2] rounded-[10px] px-3 py-[9px] text-[13.5px] text-[#474A57] placeholder:text-[#B7B9C2] outline-none transition-shadow focus:border-[#8CAF82] focus:ring-[3px] focus:ring-[#EAF2E7]";

const labelClass = "text-[11.5px] font-bold text-[#8A8D99] px-0.5 pb-1.5 block";

// Single toggle-button style used by both Category and Priority so the
// two selection controls in the form read as the same kind of thing.
function toggleClass({ selected, text, bg }) {
  return selected
    ? `${bg} ${text} border-transparent font-bold`
    : "bg-white border-[#EAE8E2] text-[#8A8D99] font-semibold hover:border-[#B7B9C2] hover:text-[#474A57]";
}

function AddTaskModal({ open: openProp, onClose, onSubmit }) {
  const [openState, setOpenState] = useState(true);
  const open = openProp !== undefined ? openProp : openState;

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("work");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [priority, setPriority] = useState("medium");
  const [error, setError] = useState("");
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const titleRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handleKey(e) {
      if (e.key === "Escape") handleClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  function resetForm() {
    setTitle("");
    setCategory("work");
    setDescription("");
    setDate("");
    setTime("");
    setPriority("medium");
    setError("");
    setServerError("");
  }

  function handleClose() {
    if (submitting) return; // don't let Escape/backdrop yank the form mid-save
    resetForm();
    if (onClose) onClose();
    else setOpenState(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Give your task a title before saving.");
      titleRef.current?.focus();
      return;
    }

    const selectedCategory = CATEGORIES.find((c) => c.id === category);
    const payload = {
      title: title.trim(),
      description: description.trim() || null,
      due_date: buildDueDate(date, time),
      category_name: selectedCategory?.label ?? null,
      // Sent for the parent/UI's benefit; createTask doesn't store this
      // yet — see the note at the top of the file.
      priority,
    };

    setServerError("");
    setSubmitting(true);
    try {
      const token = localStorage.getItem(TOKEN_KEY);

      const res = await fetch(API_BASE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(
          body.message || `Failed to create task (${res.status}).`,
        );
      }

      const created = await res.json();
      onSubmit?.({ ...created, priority });
      window.dispatchEvent(new Event("tasks:changed")); // tells <TaskList /> to refetch
      resetForm();
      if (!onClose) setOpenState(false);
      else onClose();
    } catch (err) {
      setServerError(err.message || "Couldn't save the task. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#474A57]/25 px-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-task-title"
        className="w-full max-w-[420px] bg-white border border-[#EAE8E2] rounded-[18px] px-5 py-5 font-sans text-[#474A57] shadow-[0_1px_2px_rgba(40,38,30,.04),0_6px_20px_rgba(40,38,30,.05)]"
      >
        <div className="flex items-center justify-between pb-4">
          <h2
            id="add-task-title"
            className="text-[16.5px] font-extrabold tracking-[-0.01em]"
          >
            New task
          </h2>
          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            aria-label="Close"
            className="w-7 h-7 flex items-center justify-center rounded-[8px] text-[#8A8D99] hover:bg-[#F7F6F2] transition-colors disabled:opacity-40"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-4 h-4"
            >
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className={labelClass} htmlFor="task-title">
              Title
            </label>
            <input
              id="task-title"
              ref={titleRef}
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError("");
              }}
              placeholder="e.g. Send the client proposal"
              className={`${inputClass} ${error ? "border-[#E8836C] focus:border-[#E8836C] focus:ring-[#FBEBE6]" : ""} disabled:opacity-60`}
              aria-invalid={!!error}
              aria-describedby={error ? "task-title-error" : undefined}
              disabled={submitting}
              autoFocus
            />
            {error && (
              <p
                id="task-title-error"
                className="text-[12px] font-semibold text-[#E8836C] pt-1.5 px-0.5"
              >
                {error}
              </p>
            )}
          </div>

          <div>
            <span className={labelClass}>Category</span>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={category === c.id}
                  onClick={() => setCategory(c.id)}
                  disabled={submitting}
                  className={`px-3 py-[6px] rounded-full border text-[12px] transition-colors disabled:opacity-60 ${toggleClass(
                    {
                      selected: category === c.id,
                      text: c.text,
                      bg: c.bg,
                    },
                  )}`}
                >
                  {c.icon} {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className={labelClass} htmlFor="task-date">
                Date
              </label>
              <input
                id="task-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                disabled={submitting}
                className={`${inputClass} disabled:opacity-60`}
              />
            </div>
            <div className="flex-1">
              <label className={labelClass} htmlFor="task-time">
                Time
              </label>
              <input
                id="task-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                disabled={submitting}
                className={`${inputClass} disabled:opacity-60`}
              />
            </div>
          </div>

          <div>
            <span className={labelClass}>Priority</span>
            <div className="flex gap-1.5">
              {PRIORITIES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  aria-pressed={priority === p.id}
                  onClick={() => setPriority(p.id)}
                  disabled={submitting}
                  className={`flex-1 py-[7px] rounded-[10px] border text-[12.5px] transition-colors disabled:opacity-60 ${toggleClass(
                    {
                      selected: priority === p.id,
                      text: p.text,
                      bg: p.bg,
                    },
                  )}`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="task-description">
              Description{" "}
              <span className="font-normal normal-case text-[#B7B9C2]">
                (optional)
              </span>
            </label>
            <textarea
              id="task-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add any extra detail…"
              rows={2}
              disabled={submitting}
              className={`${inputClass} resize-none disabled:opacity-60`}
            />
          </div>

          {serverError && (
            <div
              role="alert"
              className="text-[12.5px] font-semibold text-[#C1583A] bg-[#FBEBE6] rounded-[10px] px-3 py-2 -mt-1"
            >
              {serverError}
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="flex-1 py-[11px] rounded-[10px] text-[13.5px] font-bold text-[#8A8D99] hover:bg-[#F7F6F2] transition-colors disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 flex items-center justify-center gap-[7px] py-[11px] rounded-[10px] bg-[#8CAF82] text-white font-bold text-[13.5px] hover:bg-[#6B9463] transition-colors disabled:opacity-60 disabled:hover:bg-[#8CAF82]"
            >
              {submitting ? (
                <>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="w-[15px] h-[15px] animate-spin"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="white"
                      strokeOpacity="0.35"
                      strokeWidth="2.4"
                    />
                    <path
                      d="M21 12a9 9 0 0 0-9-9"
                      stroke="white"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                    />
                  </svg>
                  Adding…
                </>
              ) : (
                <>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.4"
                    className="w-[15px] h-[15px]"
                  >
                    <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                  </svg>
                  Add task
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTaskModal;
