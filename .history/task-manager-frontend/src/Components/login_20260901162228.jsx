
import React, { useState } from "react";
import logo from "../assets/logo.png";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7F6F2] px-5 py-9 font-[Manrope] text-[#474A57] antialiased">

      {/* =========================
          MAIN FRAME
      ========================= */}
      <div className="mx-auto grid min-h-[720px] w-full max-w-[1180px] grid-cols-1 overflow-hidden rounded-[22px] border border-[#EAE8E2] bg-white shadow-[0_1px_2px_rgba(40,38,30,0.04),0_6px_20px_rgba(40,38,30,0.05)] lg:grid-cols-2">

        {/* =========================
            LEFT BRAND PANEL
        ========================= */}
        <div className="relative hidden overflow-hidden bg-[#EAF2E7] p-[48px_46px] lg:flex lg:flex-col">

          {/* Background decorations */}
          <div className="absolute left-[18%] top-[8%] h-[420px] w-[560px] rounded-full bg-[#B4A7D6]/15 blur-0" />
          <div className="absolute bottom-[-20%] right-[-10%] h-[420px] w-[520px] rounded-full bg-[#F0B860]/15" />

          {/* Brand */}
          <div className="relative z-10 flex items-center gap-3 text-[18px] font-bold text-[#474A57]">
            <img
              src={logo}
              alt="Tasky logo"
              className="h-[50px] w-[50px] object-contain"
            />
          </div>

          {/* Copy */}
          <div className="relative z-10 mt-16 max-w-[360px]">
            <h1 className="text-[32px] font-extrabold leading-[1.22] tracking-[-0.015em] text-[#474A57]">
              Welcome back to your calm, focused list.
            </h1>

            <p className="mt-3.5 max-w-[320px] text-[14.5px] leading-[1.65] text-[#8A8D99]">
              Everything you left unfinished is right where you left it.
              Let's pick it back up.
            </p>
          </div>

          {/* =========================
              FLOATING TASK CARDS
          ========================= */}
          <div className="relative z-10 mt-14 flex-1">

            {/* Decorations */}
            <span className="absolute right-[26px] top-[-38px] h-[14px] w-[14px] rounded-full bg-[#F0B860]" />

            <span className="absolute right-[52px] top-[-12px] h-[9px] w-[9px] rounded-full bg-[#E8836C]" />

            <span className="absolute bottom-[64px] left-[18px] h-[10px] w-[10px] rounded-full bg-[#B4A7D6]" />

            {/* Card 1 */}
            <div className="absolute left-[6px] top-0 z-10 w-[290px] rotate-[-4.5deg] rounded-[14px] border border-[#EAE8E2] bg-white p-[14px_16px] shadow-[0_12px_30px_rgba(70,70,50,0.10)]">

              <TaskRow
                completed
                title="Send client proposal"
                description="Marlow account"
                tag="Work"
                tagStyle="sage"
              />

              <TaskRow
                title="Prep slides for team sync"
                description="Due before 2pm"
                tag="Work"
                tagStyle="peach"
              />

            </div>

            {/* Card 2 */}
            <div className="absolute left-[78px] top-[64px] z-20 w-[290px] rotate-[3deg] rounded-[14px] border border-[#EAE8E2] bg-white p-[14px_16px] shadow-[0_12px_30px_rgba(70,70,50,0.10)]">

              <TaskRow
                title="Buy groceries for the week"
                description="Milk, eggs, vegetables"
                tag="Shopping"
                tagStyle="lavender"
              />

              <TaskRow
                completed
                title="Book dentist appointment"
                description="Next Tuesday, 10am"
                tag="Personal"
                tagStyle="lavender"
              />

            </div>
          </div>

          {/* Quote */}
          <div className="relative z-10 mt-auto border-t border-[#474A57]/10 pt-6">
            <p className="max-w-[320px] font-serif text-[16px] italic leading-[1.5] text-[#474A57]">
              “A clear list is a clear mind.”
            </p>

            <span className="mt-2 block text-[12px] font-semibold text-[#8A8D99]">
              — Tasky
            </span>
          </div>
        </div>

        {/* =========================
            RIGHT FORM PANEL
        ========================= */}
        <div className="flex flex-col justify-center px-7 py-12 sm:px-12 lg:px-16">

          <div className="mx-auto w-full max-w-[360px]">

            {/* Mobile Logo */}
            <div className="mb-10 flex justify-center lg:hidden">
              <img
                src={logo}
                alt="Tasky logo"
                className="h-[70px] w-[70px] object-contain"
              />
            </div>

            {/* Form Header */}
            <div>
              <h2 className="text-[26px] font-extrabold tracking-[-0.01em]">
                Log in
              </h2>

              <p className="mt-2 text-[14px] text-[#8A8D99]">
                Welcome back — enter your details below.
              </p>
            </div>

            {/* Email */}
            <div className="mt-5">
              <label className="mb-2 block text-[13px] font-bold text-[#474A57]">
                Email
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-[10px] border-[1.4px] border-[#EAE8E2] bg-[#F7F6F2] px-3.5 py-3 text-[14px] text-[#474A57] outline-none transition-all duration-200 placeholder:text-[#B7B9C2] focus:border-[#8CAF82] focus:bg-white focus:ring-[3px] focus:ring-[#EAF2E7]"
              />
            </div>

            {/* Password */}
            <div className="mt-5">
              <label className="mb-2 block text-[13px] font-bold text-[#474A57]">
                Password
              </label>

              <div className="relative">

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full rounded-[10px] border-[1.4px] border-[#EAE8E2] bg-[#F7F6F2] px-3.5 py-3 pr-12 text-[14px] text-[#474A57] outline-none transition-all duration-200 placeholder:text-[#B7B9C2] focus:border-[#8CAF82] focus:bg-white focus:ring-[3px] focus:ring-[#EAF2E7]"
                />

                {/* Eye Button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 flex -translate-y-1/2 cursor-pointer text-[#B7B9C2] transition-colors hover:text-[#6B9463]"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-[18px] w-[18px]"
                    >
                      <path d="M3 3l18 18" />
                      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                      <path d="M9.9 4.2A10.8 10.8 0 0 1 12 4c7 0 11 8 11 8a20 20 0 0 1-3.1 4.2" />
                      <path d="M6.6 6.6C3.5 8.7 1 12 1 12s4 7 11 7a10.8 10.8 0 0 0 3.2-.5" />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-[18px] w-[18px]"
                    >
                      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>

              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="mt-[18px] flex items-center justify-between">

              <label className="flex cursor-pointer items-center gap-2 text-[13px] font-medium text-[#8A8D99]">

                <button
                  type="button"
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`flex h-4 w-4 items-center justify-center rounded-[5px] border-[1.5px] transition-all ${
                    rememberMe
                      ? "border-[#8CAF82] bg-[#8CAF82]"
                      : "border-[#B7B9C2] bg-white"
                  }`}
                >
                  {rememberMe && (
                    <svg
                      viewBox="0 0 16 16"
                      fill="none"
                      className="h-[10px] w-[10px]"
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
                </button>

                Remember me
              </label>

              <a
                href="/forgot-password"
                className="text-[13px] font-bold text-[#6B9463] transition-colors hover:text-[#474A57]"
              >
                Forgot password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="button"
              className="mt-[26px] w-full rounded-[10px] border-none bg-[#8CAF82] px-3 py-3 text-[14.5px] font-bold text-white transition-all duration-200 hover:-translate-y-[1px] hover:bg-[#6B9463]"
            >
              Log in
            </button>

            {/* Error */}
            <div className="mt-2.5 text-center text-[12.5px] font-semibold text-[#E8836C]">
              Incorrect email or password. Please try again.
            </div>

            {/* Sign Up */}
            <div className="mt-[26px] text-center text-[13.5px] text-[#8A8D99]">
              Don't have an account?{" "}
              <a
                href="/signup"
                className="font-bold text-[#6B9463] transition-colors hover:text-[#474A57]"
              >
                Sign up
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};


/* =====================================================
   TASK ROW COMPONENT
===================================================== */

const TaskRow = ({
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
    <div className="flex items-start gap-2.5 border-t border-[#EAE8E2] py-2 first:border-t-0">

      {/* Checkbox */}
      <div
        className={`mt-0.5 flex h-[17px] w-[17px] shrink-0 items-center justify-center rounded-[5px] border-[1.5px] ${
          completed
            ? "border-[#8CAF82] bg-[#8CAF82]"
            : "border-[#B7B9C2] bg-white"
        }`}
      >
        {completed && (
          <svg
            viewBox="0 0 16 16"
            fill="none"
            className="h-[10px] w-[10px]"
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
          className={`text-[12.5px] font-bold ${
            completed
              ? "font-semibold text-[#B7B9C2] line-through"
              : "text-[#474A57]"
          }`}
        >
          {title}
        </div>

        <div className="mt-0.5 text-[11px] text-[#8A8D99]">
          {description}
        </div>
      </div>

      {/* Tag */}
      <span
        className={`ml-auto rounded-full px-2 py-[3px] text-[9.5px] font-bold ${tagStyles[tagStyle]}`}
      >
        {tag}
      </span>
    </div>
  );
};

export default Login;
