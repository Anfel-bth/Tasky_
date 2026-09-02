import React from "react";
import logo from "../assets/logo.png";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white font-[Manrope] text-[#474A57]">

      {/* =========================
          NAVBAR
      ========================= */}
      <nav className="mx-auto flex max-w-[1180px] items-center justify-between px-8 py-4">

        {/* BIG LOGO */}
        <a href="/" className="flex items-center">
          <img
            src={logo}
            alt="Tasky logo"
            className="block h-[80px] w-[80px] object-contain"
          />
        </a>

        {/* Navigation */}
        <div className="hidden items-center gap-9 text-[14.5px] font-medium text-[#8A8D99] md:flex">
          <a
            href="/"
            className="transition-colors duration-200 hover:text-[#6B9463]"
          >
            Home
          </a>
        </div>

        {/* Authentication */}
        <div className="flex items-center gap-3.5">
          <a
            href="/"
            className="px-1.5 py-[11px] text-[14.5px] font-semibold text-[#474A57] transition-colors duration-200 hover:text-[#6B9463]"
          >
            Log in
          </a>

          <a
            href="/"
            className="rounded-[10px] bg-[#8CAF82] px-5 py-[11px] text-[14.5px] font-semibold text-white transition-all duration-200 hover:-translate-y-[1px] hover:bg-[#6B9463]"
          >
            Get started
          </a>
        </div>
      </nav>

      {/* =========================
          HERO
      ========================= */}
      <section className="mx-auto grid max-w-[1180px] grid-cols-1 items-center gap-[45px] px-8 py-14 pb-24 lg:grid-cols-[1fr_480px] lg:gap-16">

        {/* Hero Text */}
        <div>
          <h1 className="max-w-[560px] text-[40px] font-extrabold leading-[1.14] tracking-[-0.015em] text-[#474A57] lg:text-[46px]">
            Organize your tasks. Stay focused. Get things done.
          </h1>

          <p className="mt-5 max-w-[460px] text-[15px] leading-[1.65] text-[#8A8D99] md:text-[17px]">
            Tasky keeps your day simple — capture what needs doing, sort it
            without effort, and check it off when it's done. No clutter, no
            setup, no learning curve.
          </p>

          {/* CTA */}
          <div className="mt-8 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
            <a
              href="/"
              className="inline-flex items-center justify-center rounded-[10px] bg-[#8CAF82] px-[26px] py-3.5 text-[15px] font-semibold text-white transition-all duration-200 hover:-translate-y-[1px] hover:bg-[#6B9463]"
            >
              Get started
            </a>

            <a
              href="/login"
              className="inline-flex items-center justify-center rounded-[10px] px-[26px] py-3.5 text-[15px] font-semibold text-[#474A57] transition-colors duration-200 hover:text-[#6B9463]"
            >
              Log in
            </a>
          </div>
        </div>

        {/* =========================
            DASHBOARD PREVIEW
        ========================= */}
        <div className="mx-auto w-full max-w-[520px] rounded-[18px] border border-[#EAE8E2] bg-[#F7F6F2] p-[22px] shadow-[0_1px_2px_rgba(40,38,30,0.04),0_6px_20px_rgba(40,38,30,0.05)]">

          <div className="rounded-xl border border-[#EAE8E2] bg-white px-5 py-[18px]">

            {/* Preview Header */}
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-bold text-[#474A57]">
                Today
              </span>

              <span className="rounded-full bg-[#EAF2E7] px-2.5 py-1 text-[11.5px] font-semibold text-[#6B9463]">
                3 of 5 done
              </span>
            </div>

            {/* Task 1 */}
            <TaskPreview
              completed
              title="Send client proposal"
              description="Reviewed and sent this morning"
              tag="Work"
              tagStyle="sage"
            />

            {/* Task 2 */}
            <TaskPreview
              completed
              title="Book dentist appointment"
              description="Rescheduled to next week"
              tag="Personal"
              tagStyle="lavender"
            />

            {/* Task 3 */}
            <TaskPreview
              title="Prep slides for team sync"
              description="Due before 2pm meeting"
              tag="Work"
              tagStyle="peach"
            />

            {/* Task 4 */}
            <TaskPreview
              title="Buy groceries for the week"
              description="Milk, eggs, vegetables"
              tag="Shopping"
              tagStyle="lavender"
            />
          </div>
        </div>
      </section>

      {/* =========================
          FEATURES
      ========================= */}
      <section className="mx-auto max-w-[1180px] px-8 pb-[88px] pt-9">

        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-[520px] text-center">

          <h2 className="text-[25px] font-bold tracking-[-0.01em] text-[#474A57] md:text-[28px]">
            Everything you need, nothing you don't
          </h2>

          <p className="mt-3 text-[15px] leading-[1.6] text-[#8A8D99]">
            Tasky is built around the handful of things that actually make a
            task list useful.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 gap-7 md:grid-cols-3">

          {/* Feature 1 */}
          <FeatureCard
            type="check"
            title="Capture tasks in seconds"
            description="Add a task with a title and you're done. Details like category and status can wait until later, or never."
            iconBackground="bg-[#EAF2E7]"
            iconColor="#6B9463"
          />

          {/* Feature 2 */}
          <FeatureCard
            type="grid"
            title="Sort by what matters"
            description="Group tasks into categories like work, study, or personal, and filter down to exactly what you need to see."
            iconBackground="bg-[#F1EEF8]"
            iconColor="#8A79C4"
          />

          {/* Feature 3 */}
          <FeatureCard
            type="chart"
            title="See your progress"
            description="A quick glance at what's done and what's pending, without a wall of charts getting in the way."
            iconBackground="bg-[#FCF1DF]"
            iconColor="#D89A3C"
          />

        </div>
      </section>

      {/* =========================
          BENEFITS
      ========================= */}
      <section className="border-y border-[#EAE8E2] bg-[#F7F6F2]">

        <div className="mx-auto grid max-w-[1180px] grid-cols-1 items-center gap-10 px-8 py-14 md:py-[72px] lg:grid-cols-2 lg:gap-[60px]">

          <h2 className="max-w-[380px] text-[28px] font-bold leading-[1.25] tracking-[-0.01em] text-[#474A57]">
            Built to get out of your way
          </h2>

          <div className="flex flex-col gap-[22px]">

            <Benefit
              title="Nothing to configure"
              description="Open Tasky and start adding tasks. There's no setup between you and your list."
            />

            <Benefit
              title="Clear at a glance"
              description="Status and category are always visible, so you never have to click in to remember what a task was."
            />

            <Benefit
              title="Works the same everywhere"
              description="Desktop, tablet, or phone — the same simple layout follows you."
            />

          </div>
        </div>
      </section>

      {/* =========================
          FOOTER
      ========================= */}
      <footer className="mx-auto flex max-w-[1180px] flex-col items-center justify-between gap-5 border-t border-[#EAE8E2] px-8 py-10 md:flex-row">

        {/* BIG FOOTER LOGO */}
        <a href="/" className="flex items-center">
          <img
            src={logo}
            alt="Tasky logo"
            className="h-[55px] w-[55px] object-contain"
          />
        </a>

        {/* Footer Links */}
        <div className="order-2 flex gap-7 text-[13.5px] text-[#8A8D99]">

          <a
            href="/"
            className="transition-colors hover:text-[#6B9463]"
          >
            Home
          </a>

          <a
            href="/"
            className="transition-colors hover:text-[#6B9463]"
          >
            Support
          </a>

          <a
            href="/"
            className="transition-colors hover:text-[#6B9463]"
          >
            Privacy
          </a>

        </div>

        {/* Copyright */}
        <div className="order-3 text-[12.5px] text-[#B7B9C2]">
          © 2026 Tasky
        </div>

      </footer>
    </div>
  );
};


/* =====================================================
   TASK PREVIEW COMPONENT
===================================================== */

const TaskPreview = ({
  completed = false,
  title,
  description,
  tag,
  tagStyle,
}) => {

  const tagStyles = {
    sage: "bg-[#EAF2E7] text-[#6B9463]",
    peach: "bg-[#FCF1DF] text-[#A8730F]",
    lavender: "bg-[#F1EEF8] text-[#6C5A9E]",
  };

  return (
    <div className="flex items-start gap-3 border-t border-[#EAE8E2] py-3 first:border-t-0">

      {/* Checkbox */}
      <div
        className={`mt-0.5 flex h-[19px] w-[19px] shrink-0 items-center justify-center rounded-[6px] border-[1.6px] ${
          completed
            ? "border-[#8CAF82] bg-[#8CAF82]"
            : "border-[#B7B9C2] bg-white"
        }`}
      >

        {completed && (
          <svg
            viewBox="0 0 16 16"
            fill="none"
            className="h-[11px] w-[11px]"
          >
            <path
              d="M3 8.5L6.2 11.5L13 4.5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}

      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">

        <div
          className={`text-[13.5px] font-semibold ${
            completed
              ? "text-[#B7B9C2] line-through"
              : "text-[#474A57]"
          }`}
        >
          {title}
        </div>

        <div className="mt-0.5 text-xs text-[#8A8D99]">
          {description}
        </div>

      </div>

      {/* Tag */}
      <span
        className={`mt-px whitespace-nowrap rounded-full px-2 py-[3px] text-[10.5px] font-semibold ${tagStyles[tagStyle]}`}
      >
        {tag}
      </span>

    </div>
  );
};


/* =====================================================
   FEATURE CARD COMPONENT
===================================================== */

const FeatureCard = ({
  type,
  title,
  description,
  iconBackground,
  iconColor,
}) => {

  return (
    <div className="rounded-[18px] border border-[#EAE8E2] bg-[#F7F6F2] px-6 py-7">

      <div
        className={`mb-[18px] flex h-[38px] w-[38px] items-center justify-center rounded-[10px] ${iconBackground}`}
      >

        {/* Check Icon */}
        {type === "check" && (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M5 12l4 4 10-10"
              stroke={iconColor}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}

        {/* Grid Icon */}
        {type === "grid" && (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
          >

            <rect
              x="4"
              y="4"
              width="7"
              height="7"
              rx="1.5"
              stroke={iconColor}
              strokeWidth="2"
            />

            <rect
              x="13"
              y="4"
              width="7"
              height="7"
              rx="1.5"
              stroke={iconColor}
              strokeWidth="2"
            />

            <rect
              x="4"
              y="13"
              width="7"
              height="7"
              rx="1.5"
              stroke={iconColor}
              strokeWidth="2"
            />

            <rect
              x="13"
              y="13"
              width="7"
              height="7"
              rx="1.5"
              stroke={iconColor}
              strokeWidth="2"
            />

          </svg>
        )}

        {/* Chart Icon */}
        {type === "chart" && (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
          >

            <path
              d="M3 17l6-6 4 4 8-8"
              stroke={iconColor}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <path
              d="M15 7h6v6"
              stroke={iconColor}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

          </svg>
        )}

      </div>

      <h3 className="mb-2 text-base font-bold text-[#474A57]">
        {title}
      </h3>

      <p className="text-sm leading-[1.6] text-[#8A8D99]">
        {description}
      </p>

    </div>
  );
};


/* =====================================================
   BENEFIT COMPONENT
===================================================== */

const Benefit = ({ title, description }) => {

  return (
    <div className="flex items-start gap-3.5">

      {/* Check Circle */}
      <div className="mt-px flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#EAF2E7]">

        <svg
          viewBox="0 0 16 16"
          fill="none"
          className="h-[13px] w-[13px]"
        >
          <path
            d="M3 8.5L6.2 11.5L13 4.5"
            stroke="#6B9463"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

      </div>

      {/* Text */}
      <div>

        <strong className="mb-[3px] block text-[15px] font-bold text-[#474A57]">
          {title}
        </strong>

        <span className="text-[13.5px] leading-[1.55] text-[#8A8D99]">
          {description}
        </span>

      </div>

    </div>
  );
};

export default LandingPage;