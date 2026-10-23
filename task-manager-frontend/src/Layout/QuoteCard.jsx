// src/Layout/QuoteCard.jsx
import { useState } from "react";

const QUOTES = [
  {
    text: "A journey of a thousand miles begins with a single step.",
    author: "Lao Tzu",
  },
  {
    text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    author: "Will Durant",
  },
  { text: "Lost time is never found again.", author: "Benjamin Franklin" },
  {
    text: "Energy and persistence conquer all things.",
    author: "Benjamin Franklin",
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
  },
  {
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson",
  },
  {
    text: "Small deeds done are better than great deeds planned.",
    author: "Peter Marshall",
  },
  {
    text: "What we do every day matters more than what we do once in a while.",
    author: "Gretchen Rubin",
  },
  {
    text: "It does not matter how slowly you go as long as you do not stop.",
    author: "Confucius",
  },
  {
    text: "Well begun is half done.",
    author: "Aristotle",
  },
  {
    text: "You don’t have to be great to start, but you have to start to be great.",
    author: "Zig Ziglar",
  },
  {
    text: "Action is the foundational key to all success.",
    author: "Pablo Picasso",
  },
  {
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
  },
  {
    text: "Do what you can, with what you have, where you are.",
    author: "Theodore Roosevelt",
  },
  {
    text: "Focus on being productive instead of busy.",
    author: "Tim Ferriss",
  },
  {
    text: "Discipline is choosing between what you want now and what you want most.",
    author: "Abraham Lincoln",
  },
  {
    text: "Start where you are. Use what you have. Do what you can.",
    author: "Arthur Ashe",
  },
  {
    text: "Done is better than perfect.",
    author: "Sheryl Sandberg",
  },
];

function randomIndex(exclude) {
  let i;
  do {
    i = Math.floor(Math.random() * QUOTES.length);
  } while (i === exclude && QUOTES.length > 1);
  return i;
}

function QuoteCard() {
  const [index, setIndex] = useState(() => randomIndex(-1));
  const quote = QUOTES[index];

  return (
    <div className="flex flex-col bg-white border border-[#EAE8E2] rounded-[16px] px-4 py-3 text-[#474A57] shadow-[0_1px_2px_rgba(40,38,30,.04),0_6px_20px_rgba(40,38,30,.05)]">
      <div className="flex items-center justify-between pb-2.5 border-b border-[#EAE8E2]">
        <h2 className="text-[14px] font-bold">Quote of the day</h2>
        <button
          type="button"
          onClick={() => setIndex((i) => randomIndex(i))}
          className="text-[11px] font-bold text-[#6B9463] bg-[#EAF2E7] hover:bg-[#DCEAD7] transition-colors rounded-full px-2.5 py-0.5"
        >
          New quote
        </button>
      </div>

      <div className="py-3 px-0.5">
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5 mb-1.5 text-[#8CAF82]"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M9.5 6C6.5 7 4 9.8 4 14v4h6v-6H7.2c.2-2.2 1.3-3.6 3.3-4.4L9.5 6zm10 0c-3 1-5.5 3.8-5.5 8v4h6v-6h-2.8c.2-2.2 1.3-3.6 3.3-4.4L19.5 6z" />
        </svg>
        <p className="text-[13.5px] leading-snug font-bold text-[#474A57]">
          {quote.text}
        </p>
      </div>

      <div className="pt-2.5 border-t border-[#EAE8E2] flex items-center gap-2">
        <span className="w-[14px] h-[2px] rounded-full bg-[#8CAF82]" />
        <span className="text-[11.5px] font-semibold text-[#8A8D99]">
          {quote.author}
        </span>
      </div>
    </div>
  );
}

export default QuoteCard;
