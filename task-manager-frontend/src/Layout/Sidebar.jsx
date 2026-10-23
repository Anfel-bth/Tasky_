// src/Layout/Sidebar.jsx
import { useState } from "react";
import { NavLink } from "react-router-dom";
import AddTaskModal from "../Components/addtask.jsx";
import ProfileModal from "./ProfileModal.jsx";
import useTaskCounts from "./useTaskCounts";
import logo from "../assets/logo.png";
import { API_BASE } from "../api.js";

/**
 * Tasky Sidebar
 *
 * - Displays the current user (opens ProfileModal on click)
 * - Displays task counts (Inbox / Today / Upcoming)
 * - Add task opens the AddTaskModal
 * - Logout
 * - Dashboard navigation
 */
function Sidebar() {
  const counts = useTaskCounts();

  const [showAddTask, setShowAddTask] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Current user (login stores user_name, not name)
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const displayName = user?.user_name || user?.name || "Guest";
  const initial = displayName.charAt(0).toUpperCase();

  /**
   * Navigation link styles
   */
  const linkClass = ({ isActive }) =>
    `flex items-center gap-[11px] px-2.5 py-[9px] rounded-[10px] text-sm font-semibold cursor-pointer transition-colors [&_svg]:w-[17px] [&_svg]:h-[17px] [&_svg]:shrink-0 ${
      isActive
        ? "bg-[#EAF2E7] text-[#6B9463] [&_svg]:stroke-[#6B9463]"
        : "text-[#8A8D99] hover:bg-[#EFEEE8] [&_svg]:stroke-[#8A8D99]"
    }`;

  /**
   * Logout — drop the local session, notify the API, then leave the dashboard.
   */
  async function handleLogout() {
    const token = localStorage.getItem("token");

    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
    } catch (err) {
      console.error("Logout request failed:", err);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.replace("/login");
  }

  /**
   * Called when AddTaskModal submits a task
   */
  function handleTaskSubmit() {
    // Close modal
    setShowAddTask(false);

    // Refresh sidebar counts (useTaskCounts listens for this event)
    window.dispatchEvent(new Event("tasks:changed"));
  }

  return (
    <>
      {/* ================= SIDEBAR ================= */}
      <aside className="w-[240px] h-full flex flex-col bg-[#F7F6F2] border border-[#EAE8E2] rounded-[20px] px-4 py-[22px] font-sans text-[#474A57] shadow-[0_1px_2px_rgba(40,38,30,.04),0_6px_20px_rgba(40,38,30,.05)]">
        {/* Logo */}
        <div className="px-2 pt-1.5 pb-5">
          <img src={logo} alt="Tasky" className="h-14 w-14 object-contain" />
        </div>

        {/* ================= USER CARD ================= */}
        <button
          type="button"
          onClick={() => setShowProfile(true)}
          className="flex items-center gap-[11px] w-full px-2.5 py-2.5 rounded-[14px] bg-white border border-[#EAE8E2] mb-4 text-left hover:border-[#8CAF82] transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-[#8CAF82] text-white flex items-center justify-center font-extrabold text-sm shrink-0">
            {initial}
          </div>
          <div className="text-[13.5px] font-bold text-[#474A57] truncate">
            {displayName}
          </div>
        </button>

        {/* ================= ADD TASK BUTTON ================= */}
        <button
          type="button"
          onClick={() => setShowAddTask(true)}
          className="flex items-center justify-center gap-[7px] w-full py-[11px] rounded-[10px] mb-[22px] bg-[#8CAF82] text-white font-bold text-[13.5px] hover:bg-[#6B9463] transition-colors"
        >
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
        </button>

        {/* ================= TASKS TITLE ================= */}
        <div className="text-[11px] font-bold text-[#B7B9C2] uppercase tracking-wide px-2.5 pb-2">
          Tasks
        </div>

        {/* ================= NAVIGATION ================= */}
        <nav className="flex flex-col gap-0.5">
          {/* Inbox */}
          <NavLink to="/dashboard" end className={linkClass}>
            {({ isActive }) => (
              <>
                <InboxIcon />
                Inbox
                <CountBadge value={counts.inbox} isActive={isActive} />
              </>
            )}
          </NavLink>

          {/* Today */}
          <NavLink to="/dashboard/today" className={linkClass}>
            {({ isActive }) => (
              <>
                <TodayIcon />
                Today
                <CountBadge value={counts.today} isActive={isActive} />
              </>
            )}
          </NavLink>

          {/* Upcoming */}
          <NavLink to="/dashboard/upcoming" className={linkClass}>
            {({ isActive }) => (
              <>
                <UpcomingIcon />
                Upcoming
                <CountBadge value={counts.upcoming} isActive={isActive} />
              </>
            )}
          </NavLink>
        </nav>

        {/* ================= LOGOUT ================= */}
        <div className="mt-auto pt-4 border-t border-[#EAE8E2]">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-[11px] w-full px-2.5 py-[9px] rounded-[10px] text-sm font-semibold text-[#8A8D99] cursor-pointer hover:bg-[#EFEEE8] transition-colors [&_svg]:w-[17px] [&_svg]:h-[17px] [&_svg]:shrink-0 [&_svg]:stroke-[#8A8D99]"
          >
            <LogoutIcon />
            Log out
          </button>
        </div>
      </aside>

      <AddTaskModal
        open={showAddTask}
        onClose={() => setShowAddTask(false)}
        onSubmit={handleTaskSubmit}
      />
      {showProfile && (
        <ProfileModal user={user} onClose={() => setShowProfile(false)} />
      )}
    </>
  );
}

/* ========================================================= */
/* COUNT BADGE */
/* ========================================================= */

function CountBadge({ value, isActive }) {
  return (
    <span
      className={`ml-auto text-[11.5px] font-bold ${
        isActive ? "text-[#6B9463]" : "text-[#B7B9C2]"
      }`}
    >
      {value}
    </span>
  );
}

/* ========================================================= */
/* ICONS */
/* ========================================================= */

function InboxIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path
        d="M21 12h-6l-2 3h-6l-2-3H3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.5 6h13l2.5 6v7a1 1 0 01-1 1H4a1 1 0 01-1-1v-7l2.5-6z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TodayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M3 9h18M8 2v4M16 2v4" strokeLinecap="round" />
      <circle cx="8" cy="14" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  );
}

function UpcomingIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path
        d="M3 9h18M8 2v4M16 2v4M12 13v5M9.5 15.5L12 13l2.5 2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path
        d="M9 6l-5 6 5 6M15 6h4a2 2 0 012 2v8a2 2 0 01-2 2h-4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default Sidebar;
