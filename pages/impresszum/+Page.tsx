const LAST_UPDATED = "2026. 07. 30.";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">{title}</h2>
      <div className="space-y-3 text-base leading-8 text-white/78">{children}</div>
    </section>
  );
}

export default function Page() {
  return (
    <div className="text-(--brand-on-surface)">
      <section className="mx-auto w-full max-w-3xl px-6 pt-28 pb-8 sm:pt-32" data-reveal>
        <p className="text-sm font-semibold tracking-[0.2em] text-(--accent) uppercase">
          Jogi tájékoztató
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Impresszum
        </h1>
        <p className="mt-4 text-sm text-white/60">Utolsó frissítés: {LAST_UPDATED}</p>
      </section>

      <section className="mx-auto w-full max-w-3xl space-y-10 px-6 pb-24" data-reveal>
        <Section title="1. A szolgáltató adatai">
          <p>
            Név: Németh Szilveszter, egyéni vállalkozó
            <br />
            Székhely / levelezési cím: 9400 Sopron, Hajnal tér 14.
            <br />
            Nyilvántartási szám: [KIEGÉSZÍTENDŐ — egyéni vállalkozói nyilvántartási szám]
            <br />
            Adószám: [KIEGÉSZÍTENDŐ]
            <br />
            Nyilvántartó hatóság: a Kormányzati Ügyfélvonal, illetve az egyéni vállalkozók
            nyilvántartását vezető hatóság
          </p>
        </Section>

        <Section title="2. Elérhetőségek">
          <p>
            E-mail:{" "}
            <a href="mailto:info@synelweb.hu" className="underline underline-offset-4">
              info@synelweb.hu
            </a>
            <br />
            Telefon:{" "}
            <a href="tel:+36303645516" className="underline underline-offset-4">
              +36 30 364 5516
            </a>
            <br />
            Weboldal: synelweb.hu
          </p>
        </Section>

        <Section title="3. Domain regisztrátor és tárhelyszolgáltatók">
          <p>A synelweb.hu domain regisztrátora: Rackhost Zrt.</p>
          <p>A Weboldal működéséhez emellett az alábbi szolgáltatókat vesszük igénybe:</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>Vercel Inc. — a Weboldal (frontend) megjelenítésének hosztolása</li>
            <li>Fly.io, Inc. — a háttérrendszer (backend) hosztolása</li>
            <li>Neon, Inc. — adatbázis-hosztolás</li>
          </ul>
        </Section>

        <Section title="4. Jogérvényesítési lehetőségek">
          <p>
            Panasszal a Nemzeti Adatvédelmi és Információszabadság Hatóságnál (NAIH), illetve
            fogyasztóvédelmi ügyekben a lakóhely szerint illetékes járási hivatal fogyasztóvédelmi
            hatóságánál vagy békéltető testületnél lehet élni.
          </p>
          <p>
            NAIH elérhetősége: 1055 Budapest, Falk Miksa utca 9-11., telefon: +36 1 391 1400,
            e-mail: ugyfelszolgalat@naih.hu, honlap: www.naih.hu
          </p>
        </Section>
      </section>
    </div>
  );
}
