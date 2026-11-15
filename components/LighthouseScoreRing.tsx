import { useEffect, useId, useRef, useState } from "react";

type LighthouseScoreRingProps = {
  label: string;
  score: number;
};

// Lighthouse's own colour bands: 90-100 good, 50-89 needs work, 0-49 poor.
const TONES = {
  good: { from: "#6ee7b7", to: "#10b981", glow: "rgb(52_211_153/35%)", text: "text-emerald-300" },
  average: { from: "#fcd34d", to: "#f59e0b", glow: "rgb(245_158_11/35%)", text: "text-amber-300" },
  poor: { from: "#fda4af", to: "#f43f5e", glow: "rgb(244_63_94/35%)", text: "text-rose-300" },
} as const;

export function scoreTone(score: number): keyof typeof TONES {
  return score >= 90 ? "good" : score >= 50 ? "average" : "poor";
}

export function LighthouseScoreRing({ label, score }: LighthouseScoreRingProps) {
  const clamped = Math.max(0, Math.min(100, score));
  const tone = TONES[scoreTone(clamped)];
  const ringRef = useRef<HTMLDivElement | null>(null);
  const hasAnimatedRef = useRef(false);
  const [displayScore, setDisplayScore] = useState(0);
  const gradientId = `lh-ring-${useId().replace(/:/g, "")}`;
  const radius = 26;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const element = ringRef.current;
    if (!element || hasAnimatedRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimatedRef.current) return;

        hasAnimatedRef.current = true;
        setDisplayScore(0);

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setDisplayScore(clamped);
          });
        });

        observer.disconnect();
      },
      {
        threshold: 0.45,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [clamped]);

  useEffect(() => {
    if (hasAnimatedRef.current) {
      setDisplayScore(clamped);
    }
  }, [clamped]);

  const dashOffset = circumference * (1 - displayScore / 100);

  return (
    <div
      ref={ringRef}
      className="fancy-tile flex min-h-[7.4rem] flex-col items-center justify-between rounded-2xl p-2.5 text-center sm:min-h-[7.75rem] sm:p-3"
    >
      <p className="min-h-[2rem] max-w-[8rem] text-center text-[0.58rem] leading-tight font-semibold tracking-[0.08em] [overflow-wrap:anywhere] text-white/60 uppercase sm:text-[0.62rem]">
        {label}
      </p>
      <div className="relative mt-2 flex items-center justify-center">
        <svg
          viewBox="0 0 64 64"
          className="size-16 -rotate-90"
          style={{ filter: `drop-shadow(0 0 8px ${tone.glow.replace(/_/g, " ")})` }}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={tone.from} />
              <stop offset="100%" stopColor={tone.to} />
            </linearGradient>
          </defs>
          <circle
            cx="32"
            cy="32"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="6"
          />
          <circle
            cx="32"
            cy="32"
            r={radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition: "stroke-dashoffset 500ms ease" }}
          />
        </svg>
        <span
          className={`pointer-events-none absolute text-sm font-extrabold tabular-nums ${tone.text}`}
        >
          {Math.round(displayScore)}
        </span>
      </div>
    </div>
  );
}
