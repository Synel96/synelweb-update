type LighthouseScoreRingProps = {
  label: string;
  score: number;
};

export function LighthouseScoreRing({ label, score }: LighthouseScoreRingProps) {
  const clamped = Math.max(0, Math.min(100, score));
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - clamped / 100);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/4 p-3 text-center">
      <p className="min-h-[2rem] text-[0.58rem] leading-4 font-semibold tracking-[0.1em] text-white/65 uppercase sm:text-[0.62rem]">
        {label}
      </p>
      <div className="mt-2 flex items-center justify-center">
        <svg viewBox="0 0 64 64" className="size-16 -rotate-90" aria-hidden="true">
          <circle
            cx="32"
            cy="32"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.14)"
            strokeWidth="6"
          />
          <circle
            cx="32"
            cy="32"
            r={radius}
            fill="none"
            stroke="#22c55e"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition: "stroke-dashoffset 500ms ease" }}
          />
        </svg>
        <span className="pointer-events-none absolute text-sm font-extrabold text-[#22c55e]">
          {clamped}
        </span>
      </div>
    </div>
  );
}
