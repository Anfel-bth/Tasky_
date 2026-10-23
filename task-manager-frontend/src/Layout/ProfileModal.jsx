import { useEffect } from "react";

function ProfileModal({ user, onClose }) {
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!user) return null;

  const displayName = user.user_name || user.name || "Guest";
  const initial = displayName.charAt(0).toUpperCase();
  const email = user.email || "No email on file";
  const role = user.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : "Member";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#474A57]/25 px-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-title"
        className="w-full max-w-[380px] bg-white border border-[#EAE8E2] rounded-[18px] px-5 py-5 font-sans text-[#474A57] shadow-[0_1px_2px_rgba(40,38,30,.04),0_6px_20px_rgba(40,38,30,.05)]"
      >
        <div className="flex items-center justify-between pb-4">
          <h2
            id="profile-title"
            className="text-[16.5px] font-extrabold tracking-[-0.01em]"
          >
            Profile
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-7 h-7 flex items-center justify-center rounded-[8px] text-[#8A8D99] hover:bg-[#F7F6F2] transition-colors"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-4 h-4"
            >
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col items-center gap-2 pb-4 border-b border-[#EAE8E2] mb-4">
          <div className="w-14 h-14 rounded-full bg-[#8CAF82] text-white flex items-center justify-center font-extrabold text-xl">
            {initial}
          </div>
          <p className="text-[16px] font-extrabold tracking-[-0.01em]">
            {displayName}
          </p>
          <span className="text-[12px] font-bold rounded-full px-3 py-1 text-[#6B9463] bg-[#EAF2E7]">
            {role}
          </span>
        </div>

        <div className="flex flex-col gap-3">
          <DetailRow label="Name">{displayName}</DetailRow>
          <DetailRow label="Email">{email}</DetailRow>
          <DetailRow label="Role">{role}</DetailRow>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full mt-4 py-[11px] rounded-[10px] bg-[#8CAF82] text-white font-bold text-[13.5px] hover:bg-[#6B9463] transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}

function DetailRow({ label, children }) {
  return (
    <div>
      <span className="text-[11.5px] font-bold text-[#8A8D99] px-0.5 pb-1.5 block">
        {label}
      </span>
      <div className="bg-[#F7F6F2] border border-[#EAE8E2] rounded-[10px] px-3 py-[9px] text-[13.5px] font-semibold text-[#474A57] break-all">
        {children}
      </div>
    </div>
  );
}

export default ProfileModal;
