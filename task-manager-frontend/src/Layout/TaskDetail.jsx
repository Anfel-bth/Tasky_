import { useEffect } from "react";

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

function formatDate(due) {
  if (!due) return null;
  const [y, m, d] = String(due).slice(0, 10).split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(due) {
  if (!due) return null;
  const match = String(due).match(/T(\d{2}):(\d{2})/);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  return new Date(2000, 0, 1, hours, minutes).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatCreated(created) {
  if (!created) return null;
  const date = new Date(created);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function TaskDetail({ task, onClose, onToggle, onDelete }) {
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!task) return null;

  const done = task.status === "done";
  const style = CATEGORY_STYLES[task.category_name] || FALLBACK_STYLE;
  const priority =
    PRIORITY_STYLES[String(task.priority || "medium").toLowerCase()] ||
    PRIORITY_STYLES.medium;
  const date = formatDate(task.due_date);
  const time = formatTime(task.due_date);
  const created = formatCreated(task.created_at);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#474A57]/25 px-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-detail-title"
        className="w-full max-w-[420px] bg-white border border-[#EAE8E2] rounded-[18px] px-5 py-5 font-sans text-[#474A57] shadow-[0_1px_2px_rgba(40,38,30,.04),0_6px_20px_rgba(40,38,30,.05)]"
      >
        <div className="flex items-center justify-between pb-4">
          <h2
            id="task-detail-title"
            className="text-[16.5px] font-extrabold tracking-[-0.01em]"
          >
            Task details
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-7 h-7 flex items-center justify-center rounded-[8px] text-[#8A8D99] hover:bg-[#F7F6F2] transition-colors"
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

        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <button
              type="button"
              role="checkbox"
              aria-checked={done}
              aria-label={`Mark "${task.title}" as ${done ? "not done" : "done"}`}
              onClick={() => onToggle?.(task)}
              className={`mt-0.5 w-[18px] h-[18px] shrink-0 rounded-[5px] border flex items-center justify-center transition-colors ${
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
            <div className="min-w-0">
              <p
                className={`text-[16px] font-extrabold tracking-[-0.01em] ${
                  done ? "line-through text-[#B7B9C2]" : "text-[#474A57]"
                }`}
              >
                {task.title}
              </p>
              <span
                className={`inline-flex mt-2 text-[12px] font-bold rounded-full px-3 py-1 ${
                  done
                    ? "text-[#6B9463] bg-[#EAF2E7]"
                    : "text-[#C98A2E] bg-[#FCF1DF]"
                }`}
              >
                {done ? "Done" : "Pending"}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <DetailRow label="Priority" className="flex-1">
              <span
                className={`inline-flex text-[12px] font-bold rounded-full px-3 py-1 ${priority.bg} ${priority.text}`}
              >
                {priority.label}
              </span>
            </DetailRow>
            {task.category_name && (
              <DetailRow label="Category" className="flex-1">
                <span
                  className={`inline-flex text-[12px] font-bold rounded-full px-3 py-1 ${style.bg} ${style.text}`}
                >
                  {task.category_name}
                </span>
              </DetailRow>
            )}
          </div>

          <div className="flex gap-3">
            <DetailRow label="Date" className="flex-1">
              <p className="text-[13.5px] font-semibold text-[#474A57]">
                {date || "No date"}
              </p>
            </DetailRow>
            <DetailRow label="Time" className="flex-1">
              <p className="text-[13.5px] font-semibold text-[#474A57]">
                {time || "No time"}
              </p>
            </DetailRow>
          </div>

          <DetailRow label="Description">
            <p className="text-[13.5px] leading-relaxed text-[#474A57] whitespace-pre-wrap">
              {task.description || "No extra detail."}
            </p>
          </DetailRow>

          {created && (
            <p className="text-[11.5px] text-[#B7B9C2]">Created {created}</p>
          )}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => onDelete?.(task)}
              className="flex-1 py-[11px] rounded-[10px] text-[13.5px] font-bold text-[#C1583A] hover:bg-[#FBEBE6] transition-colors"
            >
              Delete
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-[11px] rounded-[10px] bg-[#8CAF82] text-white font-bold text-[13.5px] hover:bg-[#6B9463] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, children, className = "" }) {
  return (
    <div className={className}>
      <span className="text-[11.5px] font-bold text-[#8A8D99] px-0.5 pb-1.5 block">
        {label}
      </span>
      <div className="bg-[#F7F6F2] border border-[#EAE8E2] rounded-[10px] px-3 py-[9px]">
        {children}
      </div>
    </div>
  );
}

export default TaskDetail;
