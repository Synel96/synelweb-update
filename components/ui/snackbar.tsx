import { useEffect } from "react";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type SnackbarType = "success" | "error" | "info";

type SnackbarProps = {
  open: boolean;
  message: string;
  type?: SnackbarType;
  onClose: () => void;
  closeAriaLabel: string;
  durationMs?: number;
};

export function Snackbar({
  open,
  message,
  type = "info",
  onClose,
  closeAriaLabel,
  durationMs = 4200,
}: SnackbarProps) {
  useEffect(() => {
    if (!open) return;

    const timer = window.setTimeout(() => {
      onClose();
    }, durationMs);

    return () => {
      window.clearTimeout(timer);
    };
  }, [open, durationMs, onClose]);

  if (!open) return null;

  const variantClass =
    type === "success"
      ? "border-emerald-300/35 bg-[linear-gradient(155deg,rgba(14,30,22,0.94),rgba(10,24,18,0.98))]"
      : type === "error"
        ? "border-rose-300/35 bg-[linear-gradient(155deg,rgba(46,16,16,0.94),rgba(34,12,12,0.98))]"
        : "border-sky-300/35 bg-[linear-gradient(155deg,rgba(13,22,40,0.94),rgba(9,16,30,0.98))]";

  return (
    <div className="animate-in fade-in slide-in-from-bottom-3 fixed right-4 bottom-4 left-4 z-60 mx-auto w-full max-w-md duration-300">
      <div
        className={cn(
          "rounded-2xl border px-4 py-3 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.7)] backdrop-blur",
          variantClass
        )}
        role="status"
        aria-live="polite"
      >
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm leading-6 text-white/92">{message}</p>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            aria-label={closeAriaLabel}
            className="rounded-full border border-white/15 bg-white/5 text-white hover:bg-white/12"
          >
            <XIcon className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
