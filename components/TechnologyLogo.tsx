import djangoLogo from "@/assets/django-svgrepo-com.svg?raw";
import postgresLogo from "@/assets/postgresql-logo-svgrepo-com.svg?raw";
import pythonLogo from "@/assets/python-svgrepo-com.svg?raw";
import reactLogoUrl from "@/assets/1280px-React-icon.svg.png";
import tailwindLogo from "@/assets/tailwind-css-svgrepo-com.svg?raw";

export type TechnologyLogoName =
  | "react"
  | "tailwind"
  | "typescript"
  | "python"
  | "django"
  | "postgresql";

const TYPESCRIPT_LOGO = `
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" style="display:block;width:100%;height:100%;max-width:100%;max-height:100%;">
  <rect x="4" y="4" width="56" height="56" rx="12" fill="#3178C6" />
  <path d="M17 20h30v7h-11v25h-8V27H17z" fill="#fff" />
  <path d="M45.7 31.1c-1.8-1.1-4-1.8-6.5-1.8-5.5 0-9.1 2.9-9.1 7.3 0 3.9 2.8 5.7 7 7 3.3 1 4.2 1.7 4.2 3 0 1.5-1.2 2.5-3.3 2.5-2.2 0-4.4-.8-6.3-2.2l-2.6 6.1c2.4 1.4 5.6 2.2 8.7 2.2 6.1 0 9.9-3 9.9-7.7 0-3.7-2.2-5.8-6.8-7.3-3.4-1.1-4.4-1.6-4.4-3 0-1.1 1-2.2 3.1-2.2 2 0 3.7.6 5.5 1.7z" fill="#fff" />
</svg>`;

const SVG_LOGOS: Record<Exclude<TechnologyLogoName, "react">, string> = {
  tailwind: tailwindLogo,
  typescript: TYPESCRIPT_LOGO,
  python: pythonLogo,
  django: djangoLogo,
  postgresql: postgresLogo,
};

function sanitizeSvg(svg: string) {
  return svg
    .replace(/<\?xml[\s\S]*?\?>/gi, "")
    .replace(/<!doctype[\s\S]*?>/gi, "")
    .replace(/<!--([\s\S]*?)-->/g, "")
    .replace(/\s(width|height)="[^"]*"/gi, "")
    .replace(
      /<svg\b/i,
      '<svg preserveAspectRatio="xMidYMid meet" style="display:block;width:100%;height:100%;max-width:100%;max-height:100%;"'
    )
    .trim();
}

export function isTechnologyLogoName(value: unknown): value is TechnologyLogoName {
  return (
    value === "react" ||
    value === "tailwind" ||
    value === "typescript" ||
    value === "python" ||
    value === "django" ||
    value === "postgresql"
  );
}

export function TechnologyLogo({
  name,
  className = "size-12",
}: {
  name: TechnologyLogoName;
  className?: string;
}) {
  if (name === "react") {
    return (
      <span
        aria-hidden="true"
        className={`inline-flex shrink-0 items-center justify-center overflow-hidden ${className}`}
      >
        <img src={reactLogoUrl} alt="" className="h-full w-full object-contain" loading="lazy" />
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizeSvg(SVG_LOGOS[name]) }}
    />
  );
}
