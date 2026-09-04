import React, { useEffect, useState } from "react";
import logo from "../assest/logo.png";

const VerifyCode = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(28);

  // Countdown for resend
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Handle OTP input
  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError("");

    // Move to next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  // Verify code
  const handleVerify = (e) => {
    e.preventDefault();

    const enteredCode = code.join("");

    if (enteredCode.length !== 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    // Static example code
    if (enteredCode !== "482001") {
      setError("That code is incorrect or has expired. Please try again.");
      return;
    }

    setError("");
    alert("Email verified successfully!");
  };

  // Resend OTP
  const handleResend = () => {
    if (timeLeft > 0) return;

    setCode(["", "", "", "", "", ""]);
    setError("");
    setTimeLeft(28);

    alert("A new verification code has been sent.");
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2] px-4 py-4 font-[Manrope] text-[#474A57] sm:px-6">
      <div className="mx-auto grid min-h-[650px] max-w-[980px] overflow-hidden rounded-[18px] border border-[#EAE8E2] bg-white shadow-[0_1px_2px_rgba(40,38,30,0.04),0_6px_20px_rgba(40,38,30,0.05)] lg:grid-cols-2">
        {/* ================= LEFT PANEL ================= */}
        <div className="relative hidden overflow-hidden bg-[#EAF2E7] p-8 lg:flex lg:flex-col">
          {/* Decorative circles */}
          <div className="absolute -left-24 -top-24 h-[360px] w-[360px] rounded-full bg-[#B4A7D6]/15 blur-3xl" />
          <div className="absolute -bottom-32 -right-24 h-[360px] w-[360px] rounded-full bg-[#F0B860]/15 blur-3xl" />

          <span className="absolute right-7 top-6 h-3 w-3 rounded-full bg-[#F0B860]" />
          <span className="absolute right-14 top-11 h-2 w-2 rounded-full bg-[#E8836C]" />
          <span className="absolute bottom-16 left-5 h-2.5 w-2.5 rounded-full bg-[#B4A7D6]" />

          {/* Logo */}
          <div className="relative flex items-center gap-2.5">
            <img src={logo} alt="Tasky" className="h-6 w-6 object-contain" />
            <span className="text-[17px] font-bold">Tasky</span>
          </div>

          {/* Text */}
          <div className="relative mt-10 max-w-[330px]">
            <h1 className="text-[27px] font-extrabold leading-[1.2] tracking-[-0.015em]">
              Just one more step before your list is ready.
            </h1>

            <p className="mt-3 text-[13px] leading-[1.6] text-[#8A8D99]">
              We keep your account secure with a quick code — it only takes a
              second to confirm it's you.
            </p>
          </div>

          {/* Floating task cards */}
          <div className="relative mt-8 flex-1">
            {/* Card 1 */}
            <div className="absolute left-1 top-0 z-10 w-[250px] -rotate-[4deg] rounded-xl border border-[#EAE8E2] bg-white p-3 shadow-[0_10px_25px_rgba(70,70,50,0.10)]">
              <MiniTask
                completed
                title="Send client proposal"
                description="Marlow account"
                tag="Work"
                tagClass="bg-[#EAF2E7] text-[#6B9463]"
              />

              <MiniTask
                title="Prep slides for team sync"
                description="Due before 2pm"
                tag="Work"
                tagClass="bg-[#FCF1DF] text-[#A8730F]"
              />
            </div>

            {/* Card 2 */}
            <div className="absolute left-[70px] top-[60px] z-20 w-[250px] rotate-[3deg] rounded-xl border border-[#EAE8E2] bg-white p-3 shadow-[0_10px_25px_rgba(70,70,50,0.10)]">
              <MiniTask
                title="Buy groceries for the week"
                description="Milk, eggs, vegetables"
                tag="Shopping"
                tagClass="bg-[#F1EEF8] text-[#6C5A9E]"
              />

              <MiniTask
                completed
                title="Book dentist appointment"
                description="Next Tuesday, 10am"
                tag="Personal"
                tagClass="bg-[#F1EEF8] text-[#6C5A9E]"
              />
            </div>
          </div>

          {/* Quote */}
          <div className="relative mt-auto border-t border-[#474A57]/10 pt-4">
            <p className="font-serif text-[14px] italic leading-[1.45]">
              “A clear list is a clear mind.”
            </p>

            <span className="mt-1.5 block text-[11px] font-semibold text-[#8A8D99]">
              — Tasky
            </span>
          </div>
        </div>

        {/* ================= RIGHT PANEL ================= */}
        <div className="flex items-center justify-center px-6 py-8 sm:px-10 lg:px-12">
          <div className="w-full max-w-[360px]">
            {/* Email icon */}
            <div className="mb-5 flex h-[50px] w-[50px] items-center justify-center rounded-[13px] bg-[#EAF2E7]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6B9463"
                strokeWidth="2"
                className="h-6 w-6"
              >
                <rect x="3" y="5" width="18" height="14" rx="2.5" />

                <path
                  d="M3 7l9 6 9-6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Heading */}
            <div>
              <h2 className="text-[23px] font-extrabold tracking-[-0.01em]">
                Verify your email
              </h2>

              <p className="mt-1.5 text-[13px] leading-[1.6] text-[#8A8D99]">
                Enter the 6-digit code we sent to{" "}
                <b className="font-bold text-[#474A57]">sarah@example.com</b>
              </p>
            </div>

            {/* OTP */}
            <form onSubmit={handleVerify}>
              <div className="mt-6 flex justify-between gap-2">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className={`h-[52px] w-[45px] rounded-[11px] border-[1.4px] text-center text-[20px] font-extrabold outline-none transition sm:h-[56px] sm:w-[50px] ${
                      digit
                        ? "border-[#EAE8E2] bg-white"
                        : "border-[#EAE8E2] bg-[#F7F6F2]"
                    } focus:border-[#8CAF82] focus:bg-white focus:ring-[3px] focus:ring-[#EAF2E7]`}
                  />
                ))}
              </div>

              {/* Verify button */}
              <button
                type="submit"
                className="mt-6 w-full rounded-[9px] bg-[#8CAF82] py-2.5 text-[13.5px] font-bold text-white transition-all duration-200 hover:-translate-y-[1px] hover:bg-[#6B9463]"
              >
                Verify code
              </button>

              {/* Error */}
              {error && (
                <div className="mt-2.5 text-center text-[11.5px] font-semibold text-[#E8836C]">
                  {error}
                </div>
              )}

              {/* Resend */}
              <div className="mt-5 text-center text-[12px] text-[#8A8D99]">
                Didn't get a code?{" "}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={timeLeft > 0}
                  className={`font-bold ${
                    timeLeft > 0
                      ? "cursor-not-allowed text-[#B7B9C2]"
                      : "text-[#6B9463] hover:underline"
                  }`}
                >
                  Resend OTP
                </button>
              </div>

              {/* Timer */}
              {timeLeft > 0 && (
                <div className="mt-1.5 text-center text-[11px] text-[#B7B9C2]">
                  You can resend a new code in 00:
                  {String(timeLeft).padStart(2, "0")}
                </div>
              )}

              {/* Go back */}
              <div className="mt-5 text-center text-[12px] text-[#8A8D99]">
                Wrong email?{" "}
                <span className="font-bold text-[#6B9463]">Go back</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================= MINI TASK ================= */

const MiniTask = ({ completed = false, title, description, tag, tagClass }) => {
  return (
    <div className="flex items-start gap-2 border-t border-[#EAE8E2] py-2 first:border-t-0">
      {/* Checkbox */}
      <div
        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-[5px] border ${
          completed ? "border-[#8CAF82] bg-[#8CAF82]" : "border-[#B7B9C2]"
        }`}
      >
        {completed && (
          <svg viewBox="0 0 16 16" fill="none" className="h-2.5 w-2.5">
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
          className={`text-[10.5px] font-bold ${
            completed ? "text-[#B7B9C2] line-through" : "text-[#474A57]"
          }`}
        >
          {title}
        </div>

        <div className="mt-0.5 text-[9px] text-[#8A8D99]">{description}</div>
      </div>

      {/* Tag */}
      <span
        className={`rounded-full px-1.5 py-0.5 text-[8px] font-bold ${tagClass}`}
      >
        {tag}
      </span>
    </div>
  );
};

export default VerifyCode;
