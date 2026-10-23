import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const VerifyCode = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Email comes from the ?email=... query param set by Register/Login
  const email = searchParams.get("email") || "";

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(28);

  // Countdown
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // If someone lands here without an email (e.g. typed the URL directly),
  // send them back to register instead of showing a broken form.
  useEffect(() => {
    if (!email) {
      navigate("/register");
    }
  }, [email, navigate]);

  // OTP input
  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;

    setCode(newCode);
    setError("");

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  // Backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  // Verify
  const handleVerify = async (e) => {
    e.preventDefault();

    const enteredCode = code.join("");

    if (enteredCode.length !== 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp: enteredCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "That code is incorrect or has expired.");
        setLoading(false);
        return;
      }

      // Success - store token + user, same as login, then go to dashboard
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err) {
      console.error("Verify OTP error:", err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  // Resend
  const handleResend = async () => {
    if (timeLeft > 0 || resending) return;

    setError("");
    setResending(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/resend-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Couldn't resend the code. Please try again.");
        setResending(false);
        return;
      }

      setCode(["", "", "", "", "", ""]);
      setTimeLeft(28);
      document.getElementById("otp-0")?.focus();
    } catch (err) {
      console.error("Resend OTP error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F6F2] px-4 font-[Manrope] text-[#474A57]">
      {/* VERIFY CARD */}
      <div className="w-full max-w-[390px] rounded-[16px] border border-[#EAE8E2] bg-white px-6 py-7 shadow-[0_5px_20px_rgba(40,38,30,0.05)] sm:px-8">
        {/* Icon */}
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#EAF2E7]">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6B9463"
            strokeWidth="2"
            className="h-5 w-5"
          >
            <rect x="3" y="5" width="18" height="14" rx="2.5" />

            <path
              d="M3 7l9 6 9-6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Header */}
        <div className="mt-4 text-center">
          <h2 className="text-[20px] font-extrabold">Verify your email</h2>

          <p className="mt-1.5 text-[11.5px] leading-[1.5] text-[#8A8D99]">
            Enter the 6-digit code we sent to{" "}
            <b className="text-[#474A57]">{email || "your email"}</b>
          </p>
        </div>

        <form onSubmit={handleVerify}>
          {/* OTP BOXES */}
          <div className="mt-5 flex justify-center gap-1.5">
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
                disabled={loading}
                className="
                  h-[44px]
                  w-[40px]
                  rounded-[8px]
                  border-[1.4px]
                  border-[#EAE8E2]
                  bg-[#F7F6F2]
                  text-center
                  text-[17px]
                  font-extrabold
                  outline-none
                  transition
                  focus:border-[#8CAF82]
                  focus:bg-white
                  focus:ring-2
                  focus:ring-[#EAF2E7]
                  disabled:opacity-60
                  sm:h-[46px]
                  sm:w-[42px]
                "
              />
            ))}
          </div>

          {/* ERROR */}
          {error && (
            <p className="mt-2 text-center text-[10.5px] font-semibold text-[#E8836C]">
              {error}
            </p>
          )}

          {/* VERIFY BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="
              mt-4
              w-full
              rounded-[8px]
              bg-[#8CAF82]
              py-2.5
              text-[12.5px]
              font-bold
              text-white
              transition
              hover:bg-[#6B9463]
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {loading ? "Verifying..." : "Verify code"}
          </button>

          {/* RESEND */}
          <div className="mt-4 text-center text-[11px] text-[#8A8D99]">
            Didn't get a code?{" "}
            <button
              type="button"
              onClick={handleResend}
              disabled={timeLeft > 0 || resending}
              className={
                timeLeft > 0 || resending
                  ? "font-bold text-[#B7B9C2]"
                  : "font-bold text-[#6B9463] hover:underline"
              }
            >
              {resending ? "Resending..." : "Resend OTP"}
            </button>
          </div>

          {/* TIMER */}
          {timeLeft > 0 && (
            <p className="mt-1 text-center text-[10px] text-[#B7B9C2]">
              You can resend a new code in 00:
              {String(timeLeft).padStart(2, "0")}
            </p>
          )}

          {/* GO BACK */}
          <div className="mt-4 text-center text-[11px] text-[#8A8D99]">
            Wrong email?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="font-bold text-[#6B9463] hover:underline"
            >
              Go back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyCode;
