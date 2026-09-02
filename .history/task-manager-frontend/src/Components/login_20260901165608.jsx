import React, { useState } from "react";
import logo from "../assets/logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(false);

  const handleLogin = async () => {
    try {
      setError(false);

      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Login successful
        console.log("Login successful:", data);
        // Store user data and redirect
        localStorage.setItem("user", JSON.stringify(data.user));
        // Redirect to dashboard or home
        window.location.href = "/dashboard";
      } else {
        // Login failed
        setError(true);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2] px-4 py-5 font-[Manrope] text-[#474A57] antialiased">
      {/* =========================
          MAIN FRAME
      ========================= */}
      <div className="mx-auto grid min-h-[600px] w-full max-w-[1050px] overflow-hidden rounded-[20px] border border-[#EAE8E2] bg-white shadow-[0_1px_2px_rgba(40,38,30,0.04),0_6px_20px_rgba(40,38,30,0.05)] lg:grid-cols-2">
        {/* =========================
            LEFT BRAND PANEL
        ========================= */}
        <div className="relative hidden overflow-hidden bg-[#EAF2E7] px-10 py-8 lg:flex lg:flex-col">
          {/* Background decoration */}
          <div className="absolute -left-20 -top-20 h-[300px] w-[400px] rounded-full bg-[#B4A7D6]/15" />

          <div className="absolute -bottom-20 -right-20 h-[300px] w-[400px] rounded-full bg-[#F0B860]/15" />

          {/* Brand */}
          <div className="relative z-10 flex items-center">
            <img
              src={logo}
              alt="Tasky logo"
              className="h-[60px] w-[60px] object-contain"
            />
          </div>

          {/* Copy */}
          <div className="relative z-10 mt-10 max-w-[340px]">
            <h1 className="text-[28px] font-extrabold leading-[1.2] tracking-[-0.015em] text-[#474A57]">
              Welcome back to your calm, focused list.
            </h1>

            <p className="mt-3 text-[13.5px] leading-[1.55] text-[#8A8D99]">
              Everything you left unfinished is right where you left it. Let's
              pick it back up.
            </p>
          </div>

          {/* =========================
              TASK CARDS
          ========================= */}
          <div className="relative z-10 mt-8 flex-1">
            {/* Decorations */}
            <span className="absolute right-6 top-[-25px] h-3 w-3 rounded-full bg-[#F0B860]" />

            <span className="absolute right-12 top-[-5px] h-2 w-2 rounded-full bg-[#E8836C]" />

            <span className="absolute bottom-8 left-1 h-2.5 w-2.5 rounded-full bg-[#B4A7D6]" />

            {/* Card 1 */}
            <div className="absolute left-0 top-0 z-10 w-[255px] rotate-[-4deg] rounded-[12px] border border-[#EAE8E2] bg-white p-3 shadow-[0_10px_25px_rgba(70,70,50,0.10)]">
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
            <div className="absolute left-[65px] top-[55px] z-20 w-[255px] rotate-[3deg] rounded-[12px] border border-[#EAE8E2] bg-white p-3 shadow-[0_10px_25px_rgba(70,70,50,0.10)]">
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
          <div className="relative z-10 mt-5 border-t border-[#474A57]/10 pt-4">
            <p className="max-w-[300px] font-serif text-[14px] italic leading-[1.4] text-[#474A57]">
              “A clear list is a clear mind.”
            </p>

            <span className="mt-1.5 block text-[11px] font-semibold text-[#8A8D99]">
              — Tasky
            </span>
          </div>
        </div>

        {/* =========================
            RIGHT FORM PANEL
        ========================= */}
        <div className="flex items-center justify-center px-8 py-8 sm:px-12">
          <div className="w-full max-w-[330px]">
            {/* Mobile Logo */}
            <div className="mb-6 flex justify-center lg:hidden">
              <img
                src={logo}
                alt="Tasky logo"
                className="h-[65px] w-[65px] object-contain"
              />
            </div>

            {/* Form Header */}
            <div>
              <h2 className="text-[24px] font-extrabold tracking-[-0.01em]">
                Log in
              </h2>

              <p className="mt-1.5 text-[13px] text-[#8A8D99]">
                Welcome back — enter your details below.
              </p>
            </div>

            {/* Email */}
            <div className="mt-5">
              <label className="mb-1.5 block text-[12.5px] font-bold">
                Email
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-[9px] border-[1.4px] border-[#EAE8E2] bg-[#F7F6F2] px-3 py-2.5 text-[13px] text-[#474A57] outline-none transition-all duration-200 placeholder:text-[#B7B9C2] focus:border-[#8CAF82] focus:bg-white focus:ring-[3px] focus:ring-[#EAF2E7]"
              />
            </div>

            {/* Password */}
            <div className="mt-4">
              <label className="mb-1.5 block text-[12.5px] font-bold">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-[9px] border-[1.4px] border-[#EAE8E2] bg-[#F7F6F2] px-3 py-2.5 pr-10 text-[13px] text-[#474A57] outline-none transition-all duration-200 placeholder:text-[#B7B9C2] focus:border-[#8CAF82] focus:bg-white focus:ring-[3px] focus:ring-[#EAF2E7]"
                />

                {/* Eye */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B7B9C2] transition-colors hover:text-[#6B9463]"
                >
                  {showPassword ? (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-[17px] w-[17px]"
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
                      className="h-[17px] w-[17px]"
                    >
                      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="mt-4 flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2 text-[12px] font-medium text-[#8A8D99]">
                <button
                  type="button"
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`flex h-[15px] w-[15px] items-center justify-center rounded-[4px] border-[1.5px] ${
                    rememberMe
                      ? "border-[#8CAF82] bg-[#8CAF82]"
                      : "border-[#B7B9C2] bg-white"
                  }`}
                >
                  {rememberMe && (
                    <svg
                      viewBox="0 0 16 16"
                      fill="none"
                      className="h-[9px] w-[9px]"
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
                className="text-[12px] font-bold text-[#6B9463] hover:text-[#474A57]"
              >
                Forgot password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="button"
              onClick={handleLogin}
              className="mt-5 w-full rounded-[9px] bg-[#8CAF82] px-3 py-2.5 text-[13.5px] font-bold text-white transition-all duration-200 hover:-translate-y-[1px] hover:bg-[#6B9463]"
            >
              Log in
            </button>

            {/* ERROR - ONLY APPEARS WHEN error === true */}
            {error && (
              <div className="mt-2 text-center text-[11.5px] font-semibold text-[#E8836C]">
                Incorrect email or password. Please try again.
              </div>
            )}

            {/* Sign Up */}
            <div className="mt-5 text-center text-[12.5px] text-[#8A8D99]">
              Don't have an account?{" "}
              <a
                href="/signup"
                className="font-bold text-[#6B9463] hover:text-[#474A57]"
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
   TASK ROW
===================================================== */

const TaskRow = ({ completed = false, title, description, tag, tagStyle }) => {
  const tagStyles = {
    sage: "bg-[#EAF2E7] text-[#6B9463]",
    peach: "bg-[#FCF1DF] text-[#A8730F]",
    lavender: "bg-[#F1EEF8] text-[#6C5A9E]",
  };

  return (
    <div className="flex items-start gap-2 border-t border-[#EAE8E2] py-1.5 first:border-t-0">
      {/* Checkbox */}
      <div
        className={`mt-0.5 flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-[4px] border-[1.5px] ${
          completed
            ? "border-[#8CAF82] bg-[#8CAF82]"
            : "border-[#B7B9C2] bg-white"
        }`}
      >
        {completed && (
          <svg viewBox="0 0 16 16" fill="none" className="h-[9px] w-[9px]">
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
          className={`text-[11px] font-bold ${
            completed ? "text-[#B7B9C2] line-through" : "text-[#474A57]"
          }`}
        >
          {title}
        </div>

        <div className="mt-0.5 text-[9.5px] text-[#8A8D99]">{description}</div>
      </div>

      {/* Tag */}
      <span
        className={`ml-auto rounded-full px-1.5 py-[2px] text-[8px] font-bold ${tagStyles[tagStyle]}`}
      >
        {tag}
      </span>
    </div>
  );
};

export default Login;
