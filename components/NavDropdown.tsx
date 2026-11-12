import { useEffect, useId, useRef, useState } from "react";
import { ChevronDownIcon } from "lucide-react";

type NavDropdownProps = {
  label: string;
  href: string;
  className: string;
  items: Array<{ href: string; label: string; active: boolean }>;
  toggleLabel: string;
};

// A desktop nav link with a submenu: the label stays a plain link, the
// chevron next to it opens the submenu (also on hover). Escape and a click
// outside close it.
export function NavDropdown({ label, href, className, items, toggleLabel }: NavDropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="relative flex items-center"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          setOpen(false);
          rootRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
        }
      }}
    >
      <a href={href} className={className}>
        {label}
      </a>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={toggleLabel}
        onClick={() => setOpen((value) => !value)}
        className="ml-0.5 rounded p-0.5 text-white/60 transition-colors hover:text-(--brand-on-surface)"
      >
        <ChevronDownIcon
          className={`size-4 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
      <div
        id={menuId}
        className={`absolute top-full left-1/2 z-50 -translate-x-1/2 pt-3 ${open ? "block" : "hidden"}`}
      >
        <ul className="min-w-56 rounded-2xl border border-white/12 bg-[rgba(11,15,25,0.96)] p-2 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.8)] backdrop-blur-md">
          {items.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                aria-current={item.active ? "page" : undefined}
                className={`block rounded-xl px-3 py-2 text-sm whitespace-nowrap transition-colors ${
                  item.active
                    ? "bg-white/10 font-medium text-(--brand-on-surface)"
                    : "text-white/75 hover:bg-white/8 hover:text-(--brand-on-surface)"
                }`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
