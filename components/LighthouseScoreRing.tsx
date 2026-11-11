import { useEffect, useId, useRef, useState } from "react";

type LighthouseScoreRingProps = {
  label: string;
  score: number;
};

export function LighthouseScoreRing({ label, score }: LighthouseScoreRingProps) {
  const clamped = Math.max(0, Math.min(100, score));
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
          className="size-16 -rotate-90 drop-shadow-[0_0_8px_rgb(52_211_153/35%)]"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6ee7b7" />
              <stop offset="100%" stopColor="#10b981" />
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
        <span className="pointer-events-none absolute text-sm font-extrabold text-emerald-300 tabular-nums">
          {Math.round(displayScore)}
        </span>
      </div>
    </div>
  );
}
