// src/Layout/useTaskCounts.js
import { useCallback, useEffect, useState } from "react";

const TOKEN_KEY = "token"; // same key as the other files

/**
 * Returns { inbox, today, upcoming } for the sidebar badges.
 * Refetches whenever a task is added or deleted (the "tasks:changed"
 * window event fired by AddTaskModal and TaskList).
 */
export default function useTaskCounts() {
  const [counts, setCounts] = useState({ inbox: 0, today: 0, upcoming: 0 });

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/tasks/counts", {
        headers: { Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}` },
      });
      if (!res.ok) return;
      setCounts(await res.json());
    } catch {
      // keep the last known numbers if the request fails
    }
  }, []);

  useEffect(() => {
    load();
    const events = ["tasks:changed", "tasks:refresh", "tasks:stats-changed"];
    events.forEach((event) => window.addEventListener(event, load));
    return () => {
      events.forEach((event) => window.removeEventListener(event, load));
    };
  }, [load]);

  return counts;
}
