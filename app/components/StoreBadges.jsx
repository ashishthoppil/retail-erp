// Store badges with the availability framing:
//  - Google Play: live CTA. PLACEHOLDER URL — the listing is still in review;
//    swap PLAY_STORE_URL for the real listing link the moment it's approved.
//  - App Store: deliberate non-interactive "coming soon" state. Do not turn
//    this into a link until the iOS app actually ships.
const PLAY_STORE_URL = "#"; // PLACEHOLDER: real Google Play listing URL

function AppleLogo({ className }) {
  return (
    <svg viewBox="0 0 384 512" aria-hidden="true" className={className}>
      <path
        fill="currentColor"
        d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"
      />
    </svg>
  );
}

function PlayLogo({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="#00E0FF"
        d="M3.5 2.3c-.3.3-.5.8-.5 1.4v16.6c0 .6.2 1.1.5 1.4l.1.1 9.3-9.3v-.2L3.6 2.2l-.1.1z"
      />
      <path
        fill="#00F076"
        d="M16 15.4l-3.1-3.1v-.2l3.1-3.1.1.1 3.7 2.1c1.1.6 1.1 1.6 0 2.2l-3.8 2z"
      />
      <path
        fill="#FF3D00"
        d="M16.1 15.3L12.9 12 3.5 21.7c.4.4 1 .4 1.7.1l10.9-6.5z"
      />
      <path
        fill="#FFD500"
        d="M16.1 8.7L5.2 2.2c-.7-.4-1.3-.4-1.7.1L12.9 12l3.2-3.3z"
      />
    </svg>
  );
}

export default function StoreBadges({
  className = "",
  align = "start",
  variant = "dark",
}) {
  const justify = align === "center" ? "justify-center" : "justify-start";
  const playBase =
    variant === "light"
      ? "bg-white text-slate-900 ring-1 ring-black/5"
      : "bg-slate-900 text-white";
  const playSub = variant === "light" ? "text-slate-500" : "text-white/70";
  const appleBase =
    variant === "light"
      ? "bg-white/40 text-slate-500 ring-1 ring-white/40"
      : "bg-slate-100 text-slate-400 ring-1 ring-slate-200";
  const appleSub = variant === "light" ? "text-slate-500/80" : "text-slate-400";

  return (
    <div
      className={`flex flex-wrap items-center gap-3 ${justify} ${className}`}
    >
      <a
        href={PLAY_STORE_URL}
        aria-label="Get Retail Omega on Google Play"
        className={`inline-flex items-center gap-3 rounded-2xl px-5 py-3 shadow-md transition hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue ${playBase}`}
      >
        <PlayLogo className="h-6 w-6" />
        <span className="flex flex-col leading-none">
          <span
            className={`text-[10px] font-medium uppercase tracking-wide ${playSub}`}
          >
            Get it on
          </span>
          <span className="mt-0.5 text-lg font-semibold tracking-tight">
            Google Play
          </span>
        </span>
      </a>

      <span
        aria-disabled="true"
        title="Coming soon to the App Store"
        className={`inline-flex cursor-default select-none items-center gap-3 rounded-2xl px-5 py-3 ${appleBase}`}
      >
        <AppleLogo className="h-7 w-7 opacity-60" />
        <span className="flex flex-col leading-none">
          <span
            className={`text-[10px] font-medium uppercase tracking-wide ${appleSub}`}
          >
            Coming soon to the
          </span>
          <span className="mt-0.5 text-lg font-semibold tracking-tight opacity-70">
            App Store
          </span>
        </span>
      </span>
    </div>
  );
}
