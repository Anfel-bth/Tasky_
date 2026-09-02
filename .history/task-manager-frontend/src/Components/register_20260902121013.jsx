import React, { useState } from "react";
import logo from "../assets/logo.png";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [error, setError] = useState("");

  // Handle inputs
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  // Profile picture
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  // Simple static validation
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("Please fill in all required fields.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    setError("");
    alert("Account created successfully!");
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2] px-4 py-4 font-[Manrope] text-[#474A57] sm:px-6">
      {/* =========================
          MAIN CONTAINER
      ========================= */}
      <div className="mx-auto grid min-h-[calc(100vh-32px)] max-w-[750px] overflow-hidden rounded-[16px] border border-[#EAE8E2] bg-white shadow-[0_1px_2px_rgba(40,38,30,0.04),0_6px_20px_rgba(40,38,30,0.05)] lg:grid-cols-2">
        {/* =========================
            LEFT BRAND PANEL
        ========================= */}
        <div className="relative hidden overflow-hidden bg-[#EAF2E7] p-8 lg:flex lg:flex-col">
          {/* Decorative gradients */}
          <div className="absolute -left-24 -top-24 h-[360px] w-[360px] rounded-full bg-[#B4A7D6]/15 blur-3xl" />
          <div className="absolute -bottom-32 -right-24 h-[360px] w-[360px] rounded-full bg-[#F0B860]/15 blur-3xl" />

          {/* Decorative dots */}
          <span className="absolute right-7 top-6 h-3 w-3 rounded-full bg-[#F0B860]" />
          <span className="absolute right-14 top-11 h-2 w-2 rounded-full bg-[#E8836C]" />
          <span className="absolute bottom-16 left-5 h-2.5 w-2.5 rounded-full bg-[#B4A7D6]" />

          {/* Logo */}
          <div className="relative flex items-center gap-2.5">
            <img
              src={logo}
              alt="Tasky"
              className="h-6 w-6 object-contain"
            />

            <span className="text-[17px] font-bold">Tasky</span>
          </div>

          {/* Text */}
          <div className="relative mt-10 max-w-[330px]">
            <h1 className="text-[27px] font-extrabold leading-[1.2] tracking-[-0.015em]">
              Start your first list in under a minute.
            </h1>

            <p className="mt-3 text-[13px] leading-[1.6] text-[#8A8D99]">
              No setup, no clutter — just create an account and start adding
              what you need to get done today.
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

        {/* =========================
            RIGHT FORM PANEL
        ========================= */}
        <div className="flex items-center justify-center px-4 py-5 sm:px-6 lg:px-8">
          <div className="w-full max-w-[300px]">
            {/* Header */}
            <div>
              <h2 className="text-[20px] font-extrabold tracking-[-0.01em]">
                Create your account
              </h2>

              <p className="mt-1.5 text-[13px] text-[#8A8D99]">
                Just a few details and you're ready to go.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Full name */}
              <div className="mt-4">
                <label className="mb-1.5 block text-[12px] font-bold">
                  Full name
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Sarah Miller"
                  className="w-full rounded-[9px] border-[1.4px] border-[#EAE8E2] bg-[#F7F6F2] px-3 py-2.5 text-[13px] outline-none transition focus:border-[#8CAF82] focus:bg-white focus:ring-[3px] focus:ring-[#EAF2E7]"
                />
              </div>

              {/* Email */}
              <div className="mt-3.5">
                <label className="mb-1.5 block text-[12px] font-bold">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full rounded-[9px] border-[1.4px] border-[#EAE8E2] bg-[#F7F6F2] px-3 py-2.5 text-[13px] outline-none transition focus:border-[#8CAF82] focus:bg-white focus:ring-[3px] focus:ring-[#EAF2E7]"
                />
              </div>

              {/* Password */}
              <div className="mt-3.5">
                <label className="mb-1.5 block text-[12px] font-bold">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full rounded-[9px] border-[1.4px] border-[#EAE8E2] bg-[#F7F6F2] px-3 py-2.5 pr-10 text-[13px] outline-none transition focus:border-[#8CAF82] focus:bg-white focus:ring-[3px] focus:ring-[#EAF2E7]"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B7B9C2] transition hover:text-[#6B9463]"
                  >
                    <EyeIcon visible={showPassword} />
                  </button>
                </div>
              </div>

              {/* Confirm password */}
              <div className="mt-3.5">
                <label className="mb-1.5 block text-[12px] font-bold">
                  Confirm password
                </label>

                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full rounded-[9px] border-[1.4px] border-[#EAE8E2] bg-[#F7F6F2] px-3 py-2.5 pr-10 text-[13px] outline-none transition focus:border-[#8CAF82] focus:bg-white focus:ring-[3px] focus:ring-[#EAF2E7]"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B7B9C2] transition hover:text-[#6B9463]"
                  >
                    <EyeIcon visible={showConfirmPassword} />
                  </button>
                </div>
              </div>

              {/* Profile picture */}
              <div className="mt-4">
                <p className="mb-2 text-[11px] text-[#8A8D99]">
                  Add a profile picture —{" "}
                  <b className="font-bold text-[#474A57]">optional</b>
                </p>

                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border-[1.4px] border-dashed border-[#B7B9C2] bg-[#F7F6F2]">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Profile preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <UserIcon />
                    )}
                  </div>

                  {/* Upload */}
                  <label className="cursor-pointer rounded-lg border-[1.4px] border-[#EAE8E2] bg-[#F7F6F2] px-3.5 py-2 text-[12px] font-bold text-[#6B9463] transition hover:bg-[#EAF2E7]">
                    Upload photo

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="mt-3 rounded-lg bg-[#FBEBE6] px-3 py-2 text-center text-[11.5px] font-semibold text-[#E8836C]">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="mt-4 w-full rounded-[9px] bg-[#8CAF82] py-2.5 text-[13.5px] font-bold text-white transition-all duration-200 hover:-translate-y-[1px] hover:bg-[#6B9463]"
              >
                Create account
              </button>

              {/* Static login text — NO LINK */}
              <div className="mt-4 text-center text-[12px] text-[#8A8D99]">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="font-bold text-[#6B9463] hover:text-[#474A57]"
                >
                  Log in
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};


/* =====================================================
   MINI TASK COMPONENT
===================================================== */

const MiniTask = ({
  completed = false,
  title,
  description,
  tag,
  tagClass,
}) => {
  return (
    <div className="flex items-start gap-2 border-t border-[#EAE8E2] py-2 first:border-t-0">
      {/* Checkbox */}
      <div
        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-[5px] border ${
          completed
            ? "border-[#8CAF82] bg-[#8CAF82]"
            : "border-[#B7B9C2]"
        }`}
      >
        {completed && (
          <svg
            viewBox="0 0 16 16"
            fill="none"
            className="h-2.5 w-2.5"
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
          className={`text-[10.5px] font-bold ${
            completed
              ? "text-[#B7B9C2] line-through"
              : "text-[#474A57]"
          }`}
        >
          {title}
        </div>

        <div className="mt-0.5 text-[9px] text-[#8A8D99]">
          {description}
        </div>
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


/* =====================================================
   EYE ICON
===================================================== */

const EyeIcon = ({ visible }) => {
  return visible ? (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-[17px] w-[17px]"
    >
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-[17px] w-[17px]"
    >
      <path
        d="M2 12c3-4 6-6 10-6s7 2 10 6c-1.2 1.7-2.5 3-4 4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M6.5 17.2C4.7 16 3.2 14.3 2 12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M2 2l20 20"
        strokeLinecap="round"
      />
    </svg>
  );
};


/* =====================================================
   USER ICON
===================================================== */

const UserIcon = () => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5 text-[#B7B9C2]"
    >
      <circle cx="12" cy="8" r="3.5" />

      <path
        d="M5 20c1.4-3.8 4.4-6 7-6s5.6 2.2 7 6"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default Register;