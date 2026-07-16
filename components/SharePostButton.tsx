import { useMemo, useState } from "react";

type SharePostButtonProps = {
  url: string;
  title: string;
  text?: string;
  actionLabel: string;
  copyLabel: string;
  copiedLabel: string;
  fallbackTitle: string;
  nativeHintLabel: string;
  className?: string;
};

function toAbsoluteUrl(url: string): string {
  if (typeof window === "undefined") return url;

  try {
    return new URL(url, window.location.origin).toString();
  } catch {
    return url;
  }
}

async function copyText(value: string): Promise<boolean> {
  if (typeof navigator === "undefined") return false;

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch {
    return false;
  }

  return false;
}

export default function SharePostButton({
  url,
  title,
  text,
  actionLabel,
  copyLabel,
  copiedLabel,
  fallbackTitle,
  nativeHintLabel,
  className,
}: SharePostButtonProps) {
  const [showFallback, setShowFallback] = useState(false);
  const [copied, setCopied] = useState(false);

  const absoluteUrl = useMemo(() => toAbsoluteUrl(url), [url]);
  const encodedUrl = encodeURIComponent(absoluteUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedText = encodeURIComponent(text ? `${text}\n${absoluteUrl}` : absoluteUrl);

  const fallbackLinks = [
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodedText}`,
    },
    {
      label: "Telegram",
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      label: "Email",
      href: `mailto:?subject=${encodedTitle}&body=${encodedText}`,
    },
  ];

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({ title, text, url: absoluteUrl });
        setShowFallback(false);
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
      }
    }

    setShowFallback((prev) => !prev);
  };

  const handleCopy = async () => {
    const didCopy = await copyText(absoluteUrl);
    if (!didCopy) return;

    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="relative inline-flex">
      <button type="button" onClick={handleShare} className={className}>
        {actionLabel}
      </button>

      {showFallback ? (
        <div className="absolute right-0 top-full z-20 mt-2 w-64 rounded-2xl border border-white/15 bg-[#0d1426] p-3 shadow-[0_20px_42px_-20px_rgba(0,0,0,0.8)]">
          <p className="mb-2 text-xs font-semibold tracking-[0.08em] text-white/70 uppercase">
            {fallbackTitle}
          </p>

          <div className="grid grid-cols-2 gap-2">
            {fallbackLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-white/12 bg-white/5 px-2 py-1.5 text-center text-xs font-medium text-white/86 transition hover:bg-white/10"
              >
                {item.label}
              </a>
            ))}
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="mt-2 w-full rounded-lg border border-(--accent)/45 bg-(--accent)/12 px-3 py-1.5 text-xs font-semibold text-(--accent) transition hover:bg-(--accent)/20"
          >
            {copied ? copiedLabel : copyLabel}
          </button>

          <p className="mt-2 text-[11px] leading-5 text-white/60">{nativeHintLabel}</p>
        </div>
      ) : null}
    </div>
  );
}
