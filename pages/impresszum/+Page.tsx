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
      <section className="mx-auto w-full max-w-3xl px-6 pt-28 pb-8 sm:pt-32">
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
            Az alábbi adatok közzétételét az elektronikus kereskedelmi szolgáltatások, valamint az
            információs társadalommal összefüggő szolgáltatások egyes kérdéseiről szóló 2001. évi
            CVIII. törvény ("Eker. tv.") 4. §-a írja elő.
          </p>
          <p>
            Név: Németh Szilveszter, egyéni vállalkozó
            <br />
            Székhely / levelezési cím: 9400 Sopron, Hajnal tér 14.
            <br />
            Nyilvántartási szám: 63006362
            <br />
            Adószám: 92506769-1-28
            <br />
            Nyilvántartó hatóság: az egyéni vállalkozók nyilvántartását vezető hatóság (a
            nyilvántartásba vétel az egyéni vállalkozóról és az egyéni cégről szóló 2009. évi CXV.
            törvény alapján történt)
          </p>
        </Section>

        <Section title="2. Elérhetőségek">
          <p>
            Az Eker. tv. 4. § b) pontja alapján az alábbi, rendszeresen használt elektronikus
            levelezési cím szolgál a kapcsolattartásra:
          </p>
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
          <p>
            Az Eker. tv. 4. § e) pontja alapján az információs társadalommal összefüggő szolgáltatás
            nyújtásában közreműködő tárhelyszolgáltatók adatai:
          </p>
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
            Fogyasztóvédelmi ügyekben a fogyasztóvédelemről szóló 1997. évi CLV. törvény alapján a
            lakóhely szerint illetékes járási hivatal fogyasztóvédelmi hatóságánál, illetve a
            területileg illetékes békéltető testületnél lehet panasszal élni. Személyes adatok
            kezelésével összefüggő panasszal a GDPR (az Európai Parlament és a Tanács (EU) 2016/679
            rendelete) 77. cikke és az információs önrendelkezési jogról és az
            információszabadságról szóló 2011. évi CXII. törvény (Infotv.) alapján a Nemzeti
            Adatvédelmi és Információszabadság Hatósághoz (NAIH) lehet fordulni.
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
