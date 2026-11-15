import {
  BadgeCheckIcon,
  CalendarClockIcon,
  ChevronDownIcon,
  CircleCheckIcon,
  CircleXIcon,
  ExternalLinkIcon,
  ScaleIcon,
  WalletIcon,
  type LucideIcon,
} from "lucide-react";
import { ConversionCtaButton } from "@/components/ConversionCtaButton";
import { trackEvent } from "@/src/analytics";
import { localizePath } from "@/src/localizedRoutes";
import { quoteFormHref } from "@/src/quoteForm";

// Hungarian-only page about building a website from a grant (DIMOP Plusz and
// the like). It is written for someone deciding, so it says plainly that
// SynelWeb is not an accredited (MVP) supplier and what that means.

const UPDATED = "2026. november";

const CHECKS: Array<{ Icon: LucideIcon; title: string; text: string }> = [
  {
    Icon: BadgeCheckIcon,
    title: "Minősített szállító",
    text: "A DIMOP Plusz kiírásokban a honlap és a webshop jellemzően csak a Modern Vállalkozások Programja minősített szállítói listáján szereplő cégtől számolható el. Ha nem tőlük rendeled, a hatóság elutasíthatja az elszámolást, és a támogatást vissza kellhet fizetni. Mindig az adott felhívás dönt.",
  },
  {
    Icon: CalendarClockIcon,
    title: "Kiírások hullámokban",
    text: "A pályázatok csak egy-egy időszakban nyitottak. A 2026-os DIMOP Plusz-1.2.6/B-26 kiírás beadási határideje 2026. június 29-én lejárt. A következő kiírás időpontját a hivatalos pályázati portálon érdemes figyelni.",
  },
  {
    Icon: WalletIcon,
    title: "Önerő és elszámolás",
    text: "A támogatás mellé jellemzően önerő is kell (a 2026-os kiírásban legalább 10%), és az elszámolás menetét is a felhívás határozza meg. Érdemes előre végiggondolni, mikor és mennyit kell megelőlegezni.",
  },
  {
    Icon: ScaleIcon,
    title: "Fenntartás és adminisztráció",
    text: "A támogatott fejlesztésekhez jellemzően fenntartási kötelezettség és adminisztráció tartozik: dokumentálni kell, és a weboldalt egy ideig működtetni kell. Ezt is számold bele, ne csak a támogatás összegét.",
  },
];

const CAN = [
  "Ha a felhívás a weboldal-tételre nem ír elő minősített szállítót: szabályos árajánlatot, szerződést és teljesítésigazolást adok.",
  "Megnézem veled a felhívást: ha elküldöd a kódját, megmondom, szerintem kell-e hozzá minősített szállító.",
  "Szabadpiaci alapon, átlátható árakon elkészítem az oldalt, ha nem szeretnél a következő kiírásra várni.",
];

const CANNOT = [
  "Nem szerepelek a minősített szállítói listán, ezért ahol a felhívás ezt előírja, a weboldal nem tőlem számolható el. Ilyenkor ezt előre megmondom, és nem vállalom a weboldal-tételt, hogy ne kockáztasd a támogatást.",
];

const FAQ: Array<{ q: string; a: string }> = [
  {
    q: "Minősített (MVP) szállító vagy?",
    a: "Nem: szabadpiaci alapon dolgozom. Ezt azért írom le ennyire egyértelműen, mert egy pályázatnál ez dönti el, elszámolható-e a weboldal.",
  },
  {
    q: "Honnan tudom, hogy kell-e minősített szállító?",
    a: "A felhívás és a hozzá tartozó szállítói segédlet tételesen jelöli. Ha bizonytalan vagy, küldd el a felhívás kódját vagy a pályázatíród válaszát, és megnézzük együtt.",
  },
  {
    q: "Mikor lesz új DIMOP kiírás?",
    a: "Ezt a hivatalos pályázati portál közli. Nem ígérek időpontot, mert a kiírások időzítése és feltételei is változnak.",
  },
  {
    q: "Megéri inkább szabadpiaci alapon csináltatni?",
    a: "Ha nem nyitott most kiírás, vagy nem szeretnél a pályázati folyamattal és a fenntartási kötelezettséggel foglalkozni, a szabadpiaci weboldal hamarabb elkészül és rugalmasabb. Ha a támogatás nagy része elszámolható, a pályázat lehet a jobb út – ezt érdemes a konkrét számokkal összevetni.",
  },
];

const SOURCES = [
  {
    label: "Modern Vállalkozások Programja – minősített szállítók",
    href: "https://vallalkozzdigitalisan.mkik.hu/minositett_szallitok.html",
  },
  { label: "Hivatalos pályázati portál", href: "https://palyazat.gov.hu/" },
];

export default function Page() {
  const quoteHref = quoteFormHref("hu");

  return (
    <>
      <section className="mx-auto w-full max-w-6xl px-6 pt-36 pb-12 text-center sm:pt-40 sm:pb-16">
        <p className="fancy-eyebrow text-xs font-semibold tracking-[0.2em] text-(--accent) uppercase">
          Pályázati weboldal
        </p>
        <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-balance text-white sm:text-5xl">
          Weboldal pályázati forrásból: mire figyelj?
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-left text-base leading-8 text-white/78 sm:text-center sm:text-lg">
          Ha DIMOP Plusz vagy más KKV-pályázat támogatásából fejlesztenéd a weboldalad, a
          legfontosabb kérdés nem az ár, hanem az, hogy a weboldal elszámolható lesz-e.
          Összeszedtem, mire figyelj – és őszintén leírom, miben tudok segíteni.
        </p>
        <p className="mt-4 text-sm text-white/55">Frissítve: {UPDATED}</p>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-16 sm:pb-20" data-reveal>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold tracking-[0.22em] text-(--color-secondary-warm) uppercase">
            Mielőtt belevágsz
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance text-white sm:text-4xl">
            Négy dolog, ami eldönti a pályázati weboldal sorsát
          </h2>
        </div>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {CHECKS.map(({ Icon, title, text }) => (
            <li key={title} className="fancy-card rounded-2xl p-5 sm:p-6">
              <div className="flex gap-4">
                <span className="fancy-tile flex size-11 shrink-0 items-center justify-center rounded-xl">
                  <Icon className="size-5 text-(--accent)" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-7 text-white/78 sm:text-base">{text}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-16 sm:pb-20" data-reveal>
        <div className="fancy-card mx-auto max-w-4xl rounded-3xl p-6 sm:p-8">
          <p className="text-center text-xs font-semibold tracking-[0.18em] text-(--color-secondary-warm) uppercase">
            Őszintén
          </p>
          <h2 className="mt-2 text-center text-2xl font-semibold tracking-tight text-balance text-white sm:text-3xl">
            Szabadpiaci alapon dolgozom – ebben tudok segíteni
          </h2>
          <div className="mt-6 grid gap-6 md:grid-cols-[1.4fr_1fr]">
            <ul className="space-y-3">
              {CAN.map((item) => (
                <li
                  key={item}
                  className="flex gap-2.5 text-sm leading-6 text-white/82 sm:text-base"
                >
                  <CircleCheckIcon
                    className="mt-1 size-4 shrink-0 text-emerald-300"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="rounded-2xl border border-white/10 bg-white/4 p-4 sm:p-5">
              {CANNOT.map((item) => (
                <p key={item} className="flex gap-2.5 text-sm leading-6 text-white/78 sm:text-base">
                  <CircleXIcon className="mt-1 size-4 shrink-0 text-rose-300" aria-hidden="true" />
                  <span>{item}</span>
                </p>
              ))}
            </div>
          </div>
          <p className="mt-6 border-t border-white/10 pt-5 text-center text-sm text-white/70">
            A szabadpiaci árakat a{" "}
            <a
              href={localizePath("/services", "hu")}
              className="font-semibold text-(--accent) hover:text-(--primary)"
            >
              szolgáltatások oldalon
            </a>{" "}
            látod.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-3xl px-6 pb-16 sm:pb-20" data-reveal>
        <h2 className="text-center text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Gyakori kérdések
        </h2>
        <div className="mt-8 space-y-3">
          {FAQ.map(({ q, a }) => (
            <details key={q} className="fancy-card group rounded-2xl p-5 open:pb-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-white [&::-webkit-details-marker]:hidden">
                <h3 className="text-base sm:text-lg">{q}</h3>
                <ChevronDownIcon
                  className="size-5 shrink-0 text-(--accent) transition-transform group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <p className="mt-3 text-base leading-7 text-white/78">{a}</p>
            </details>
          ))}
        </div>
        <div className="mt-8 text-sm text-white/60">
          <p className="font-semibold text-white/75">Hivatalos források:</p>
          <ul className="mt-2 space-y-1.5">
            {SOURCES.map((source) => (
              <li key={source.href}>
                <a
                  href={source.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-(--accent) hover:text-(--primary)"
                >
                  {source.label}
                  <ExternalLinkIcon className="size-3.5" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-white/45">
            Ez az oldal tájékoztatás, nem pályázati vagy jogi tanácsadás. A pontos feltételeket
            mindig az adott felhívás tartalmazza.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-20 sm:pb-24">
        <div className="fancy-card flex flex-col items-start gap-6 rounded-3xl p-6 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight text-balance text-white sm:text-3xl">
              Kérdésed van a pályázatodról?
            </h2>
            <p className="mt-3 text-base leading-7 text-white/75">
              Írd meg, milyen felhívásból fejlesztenél, és megnézzük, hogyan tudok segíteni – vagy
              őszintén megmondom, ha nem nálam van a helye.
            </p>
          </div>
          <ConversionCtaButton
            href={quoteHref}
            onClick={() => trackEvent("quote_cta_click", { location: "grants" })}
          >
            Írok a pályázatomról
          </ConversionCtaButton>
        </div>
      </section>
    </>
  );
}
