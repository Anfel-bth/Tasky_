// src/Components/inbox.jsx
import TaskList from "../Layout/TaskList.jsx";
import QuoteCard from "../Layout/QuoteCard.jsx";

export default function Inbox() {
  return (
    <div className="p-6 max-w-[900px] flex flex-col md:flex-row gap-6 items-start">
      <div className="flex-1 min-w-0 w-full">
        <TaskList title="Inbox" groupByDay />
      </div>
      <div className="w-full md:w-[250px] shrink-0">
        <QuoteCard />
      </div>
    </div>
  );
}
