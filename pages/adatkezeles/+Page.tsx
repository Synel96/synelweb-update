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
          Adatkezelési tájékoztató
        </h1>
        <p className="mt-4 text-sm text-white/60">Utolsó frissítés: {LAST_UPDATED}</p>
      </section>

      <section className="mx-auto w-full max-w-3xl space-y-10 px-6 pb-24" data-reveal>
        <Section title="1. Az adatkezelő">
          <p>
            Név: Németh Szilveszter
            <br />
            E-mail: <a href="mailto:info@synelweb.hu" className="underline underline-offset-4">info@synelweb.hu</a>
            <br />
            Telefon: <a href="tel:+36303645516" className="underline underline-offset-4">+36 30 364 5516</a>
          </p>
        </Section>

        <Section title="2. A tájékoztató célja és hatálya">
          <p>
            Jelen tájékoztató bemutatja, hogy a synelweb.hu weboldal (a továbbiakban: Weboldal)
            üzemeltetése során milyen személyes adatokat kezelünk, milyen célból, milyen jogalapon,
            meddig, valamint hogy milyen jogok illetik meg az érintetteket. A tájékoztató az Európai
            Parlament és a Tanács (EU) 2016/679 rendelete (általános adatvédelmi rendelet, GDPR)
            alapján készült.
          </p>
        </Section>

        <Section title="3. A kezelt adatok köre, célja és jogalapja">
          <p className="font-semibold text-white">Vélemény / értékelés beküldése</p>
          <p>
            Kezelt adatok: név, e-mail cím, értékelés (csillagszám), a vélemény szövege.
          </p>
          <p>
            Cél: a beküldött vélemény moderálást követő közzététele a Weboldalon. A név, az
            értékelés és a vélemény szövege a jóváhagyást követően nyilvánosan megjelenik a
            Weboldalon; az e-mail címet nem tesszük közzé, azt kizárólag a kapcsolattartáshoz és a
            visszaélésszerű beküldések kiszűréséhez használjuk.
          </p>
          <p>
            Jogalap: az érintett önkéntes hozzájárulása (GDPR 6. cikk (1) bekezdés a) pont), amelyet
            a vélemény beküldésével ad meg.
          </p>
          <p>
            Megőrzési idő: az adatokat a törlésükig, illetve a hozzájárulás visszavonásáig kezeljük.
          </p>
        </Section>

        <Section title="4. Adatfeldolgozók">
          <p>
            A Weboldal üzemeltetéséhez az alábbi technikai szolgáltatókat vesszük igénybe, amelyek a
            személyes adatokhoz tárhely- és adatbázis-szolgáltatás nyújtása céljából férhetnek hozzá:
            Fly.io (alkalmazás-hoszting), Neon (adatbázis-hoszting) és Vercel (a Weboldal
            megjelenítését szolgáló frontend hosztolása). Ezek a szolgáltatók adatfeldolgozóként
            járnak el, az adatokat saját célra nem használják fel.
          </p>
        </Section>

        <Section title="5. Külső szolgáltató által beágyazott tartalom (Google Térkép)">
          <p>
            A Kapcsolat oldalon a szolgáltatás helyszínének bemutatásához a Google Térkép (Google
            Maps) beágyazott térképét használjuk. A térkép betöltésekor a böngésződ közvetlenül
            kapcsolatba lép a Google szervereivel; ennek során a Google adatokat gyűjthet (például
            IP-cím, eszközadatok), és cookie-kat helyezhet el a saját adatvédelmi szabályzata szerint.
            Ezen adatkezelés felett nincs ráhatásunk; arra a Google (Google Ireland Limited)
            adatvédelmi tájékoztatója az irányadó:{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4"
            >
              policies.google.com/privacy
            </a>
            .
          </p>
        </Section>

        <Section title="6. Az érintettek jogai">
          <p>Az érintett a fenti elérhetőségeken (info@synelweb.hu) bármikor:</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>tájékoztatást kérhet a rá vonatkozó adatkezelésről,</li>
            <li>kérheti adatai helyesbítését,</li>
            <li>kérheti adatai törlését,</li>
            <li>kérheti az adatkezelés korlátozását,</li>
            <li>tiltakozhat az adatkezelés ellen,</li>
            <li>élhet az adathordozhatósághoz való jogával,</li>
            <li>
              bármikor, indoklás nélkül visszavonhatja a hozzájárulását — a visszavonás nem érinti a
              visszavonás előtti adatkezelés jogszerűségét.
            </li>
          </ul>
        </Section>

        <Section title="7. Jogorvoslati lehetőségek">
          <p>
            Amennyiben úgy ítéli meg, hogy adatainak kezelése sérti a GDPR rendelkezéseit, panasszal
            élhet a Nemzeti Adatvédelmi és Információszabadság Hatóságnál (NAIH):
          </p>
          <p>
            Cím: 1055 Budapest, Falk Miksa utca 9-11.
            <br />
            Postacím: 1363 Budapest, Pf. 9.
            <br />
            Telefon: +36 1 391 1400
            <br />
            E-mail: ugyfelszolgalat@naih.hu
            <br />
            Honlap: www.naih.hu
          </p>
          <p>Az érintett a jogainak megsértése esetén bírósághoz is fordulhat.</p>
        </Section>

        <Section title="8. A tájékoztató módosítása">
          <p>
            Amennyiben a Weboldalon kezelt adatok köre vagy célja bővül (például kapcsolatfelvételi
            űrlap, hírlevél vagy statisztikai mérés bevezetésével), jelen tájékoztatót frissítjük, és
            a Weboldalon közzétesszük annak aktuális, hatályos verzióját.
          </p>
        </Section>
      </section>
    </div>
  );
}
