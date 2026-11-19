const LAST_UPDATED = "2026. 11. 19.";

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
            Név: Németh Szilveszter, egyéni vállalkozó
            <br />
            Székhely / levelezési cím: 9400 Sopron, Hajnal tér 14.
            <br />
            Nyilvántartási szám: 63006362
            <br />
            Adószám: 92506769-1-28
            <br />
            E-mail:{" "}
            <a href="mailto:info@synelweb.hu" className="underline underline-offset-4">
              info@synelweb.hu
            </a>
            <br />
            Telefon:{" "}
            <a href="tel:+36303645516" className="underline underline-offset-4">
              +36 30 364 5516
            </a>
          </p>
        </Section>

        <Section title="2. A tájékoztató célja és hatálya">
          <p>
            Jelen tájékoztató bemutatja, hogy a synelweb.hu weboldal (a továbbiakban: Weboldal)
            üzemeltetése során milyen személyes adatokat kezelünk, milyen célból, milyen jogalapon,
            meddig, valamint hogy milyen jogok illetik meg az érintetteket. Az előzetes, átlátható
            tájékoztatás kötelezettségét az Európai Parlament és a Tanács (EU) 2016/679 rendelete
            (általános adatvédelmi rendelet, "GDPR") 12–14. cikke írja elő, a tájékoztató emellett
            az információs önrendelkezési jogról és az információszabadságról szóló 2011. évi CXII.
            törvény (Infotv.) rendelkezéseivel összhangban készült.
          </p>
        </Section>

        <Section title="3. A kezelt adatok köre, célja és jogalapja">
          <p className="font-semibold text-white">Vélemény / értékelés beküldése</p>
          <p>Kezelt adatok: név, e-mail cím, értékelés (csillagszám), a vélemény szövege.</p>
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
            Megőrzési idő: az adatokat a törlésükig, illetve a hozzájárulás visszavonásáig kezeljük,
            összhangban a GDPR 5. cikk (1) bekezdés e) pontjában foglalt korlátozott tárolhatóság
            elvével.
          </p>

          <p className="pt-4 font-semibold text-white">Ajánlatkérés (ajánlatkérő űrlap)</p>
          <p>
            Kezelt adatok: név, e-mail cím, telefonszám (nem kötelező), a választott szolgáltatás, a
            kapcsolatfelvétel kívánt módja, az üzenet szövege, részletes ajánlatkérés esetén a
            projektre vonatkozó válaszok (például meglévő weboldal címe, domain, nyelvek,
            keretösszeg), valamint – ha az érintett kifejezetten kéri – a csatolt
            weboldal-ellenőrzés eredménye.
          </p>
          <p>
            Cél: az ajánlatkérés megválaszolása, kapcsolatfelvétel és árajánlat készítése. Az
            ajánlatkérésről e-mail értesítést kapunk, amely a megadott adatokat tartalmazza.
          </p>
          <p>
            Jogalap: az érintett önkéntes hozzájárulása (GDPR 6. cikk (1) bekezdés a) pont), amelyet
            az űrlap elküldésekor ad meg.
          </p>
          <p>
            Megőrzési idő: az ajánlatkéréstől számított legfeljebb 1 évig, illetve a hozzájárulás
            visszavonásáig; ha az ajánlatkérésből szerződés jön létre, a szerződésre vonatkozó
            jogszabályi megőrzési idők szerint.
          </p>

          <p className="pt-4 font-semibold text-white">Ingyenes weboldal-ellenőrzés</p>
          <p>
            A weboldal-ellenőrző eszköz használatakor az ellenőrzött weboldal címét, a választott
            eszközt (mobil/asztali), a nyelvet, a mért pontszámokat és a mérés idejét tároljuk; ezek
            önmagukban nem minősülnek személyes adatnak. Az ellenőrzött címet a mérés elvégzése
            céljából a Google PageSpeed Insights szolgáltatásának (Google LLC) továbbítjuk; a
            látogató saját adatait (például IP-címét) a Google felé nem adjuk át.
          </p>
          <p>
            A visszaélések megelőzése érdekében (a mérések számának korlátozásához) a látogató
            IP-címét legfeljebb egy órán át, átmenetileg kezeljük, majd automatikusan töröljük.
            Jogalap: jogos érdek (GDPR 6. cikk (1) bekezdés f) pont) – a szolgáltatás
            rendeltetésszerű működésének biztosítása.
          </p>
          <p>
            A legutóbbi mérés eredményét a böngésző munkamenet-tárhelye (sessionStorage) őrzi meg a
            látogató saját eszközén, hogy az ajánlatkérésnél csatolni lehessen. Ez nem cookie,
            hozzánk csak akkor kerül, ha a látogató az ajánlatkérő űrlapon kifejezetten csatolja, és
            a böngészőlap bezárásával törlődik.
          </p>

          <p className="pt-4 font-semibold text-white">Látogatottság-mérés</p>
          <p>
            A Weboldal látogatottságát a Vercel Web Analytics szolgáltatással mérjük, amely nem
            használ cookie-kat, és a látogatókat nem azonosítja: összesített statisztikát készít
            (például oldalmegtekintések, hivatkozó oldalak, eszköztípus), valamint egyes
            műveletekről (például az ajánlatkérő űrlap lépései, a weboldal-ellenőrzés indítása)
            személyes adatot nem tartalmazó eseményeket rögzít. Jogalap: jogos érdek (GDPR 6. cikk
            (1) bekezdés f) pont) – a Weboldal fejlesztése és a szolgáltatások javítása.
          </p>
        </Section>

        <Section title="4. Adatfeldolgozók">
          <p>
            A Weboldal üzemeltetéséhez az alábbi technikai szolgáltatókat vesszük igénybe, amelyek a
            személyes adatokhoz tárhely- és adatbázis-szolgáltatás nyújtása céljából férhetnek
            hozzá: Fly.io (alkalmazás-hoszting), Neon (adatbázis-hoszting), Vercel (a Weboldal
            megjelenítését szolgáló frontend hosztolása és a látogatottság-mérés), Rackhost (az
            ajánlatkérésekről szóló e-mail értesítések kézbesítése és a levelezés) és Cloudinary (a
            Weboldal képeinek és videóinak tárolása és kiszolgálása). Ezek a szolgáltatók a GDPR 28.
            cikke szerinti adatfeldolgozóként járnak el, az adatokat saját célra nem használják fel.
          </p>
        </Section>

        <Section title="5. Külső szolgáltató által beágyazott tartalom (Google Térkép)">
          <p>
            A Kapcsolat oldalon a szolgáltatás helyszínének bemutatásához a Google Térkép (Google
            Maps) beágyazott térképét kínáljuk. A térkép alapértelmezésként nem töltődik be: csak
            akkor jelenik meg, ha a látogató a „Térkép megjelenítése” gombra kattint. Ennek
            jogalapja a GDPR 6. cikk (1) bekezdés a) pontja szerinti hozzájárulás, amelyet a
            látogató a gomb megnyomásával ad meg. A térkép betöltésekor a böngésződ közvetlenül
            kapcsolatba lép a Google szervereivel; ennek során a Google adatokat gyűjthet (például
            IP-cím, eszközadatok), és cookie-kat helyezhet el a saját adatvédelmi szabályzata
            szerint. Ezen adatkezelés felett nincs ráhatásunk; arra a Google (Google Ireland
            Limited) önálló adatkezelőként eljárva, saját adatvédelmi tájékoztatója az irányadó:{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4"
            >
              policies.google.com/privacy
            </a>
            . A gomb mellett elérhető „Megnyitás a Google Térképen” link a Google saját oldalát
            nyitja meg, a Weboldalra nem tölt be semmit.
          </p>
        </Section>

        <Section title="6. Az érintettek jogai">
          <p>
            Az érintett a fenti elérhetőségeken (info@synelweb.hu), a GDPR III. fejezetében (15–22.
            cikk) foglalt jogai alapján bármikor:
          </p>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              tájékoztatást, hozzáférést kérhet a rá vonatkozó adatkezelésről (GDPR 15. cikk),
            </li>
            <li>kérheti adatai helyesbítését (GDPR 16. cikk),</li>
            <li>kérheti adatai törlését (GDPR 17. cikk),</li>
            <li>kérheti az adatkezelés korlátozását (GDPR 18. cikk),</li>
            <li>tiltakozhat az adatkezelés ellen (GDPR 21. cikk),</li>
            <li>élhet az adathordozhatósághoz való jogával (GDPR 20. cikk),</li>
            <li>
              bármikor, indoklás nélkül visszavonhatja a hozzájárulását (GDPR 7. cikk (3) bekezdés)
              — a visszavonás nem érinti a visszavonás előtti adatkezelés jogszerűségét.
            </li>
          </ul>
        </Section>

        <Section title="7. Jogorvoslati lehetőségek">
          <p>
            Amennyiben úgy ítéli meg, hogy adatainak kezelése sérti a GDPR rendelkezéseit, a GDPR
            77. cikke és az Infotv. alapján panasszal élhet a Nemzeti Adatvédelmi és
            Információszabadság Hatóságnál (NAIH):
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
          <p>
            Az érintett a jogainak megsértése esetén a GDPR 79. cikke alapján bírósághoz is
            fordulhat.
          </p>
        </Section>

        <Section title="8. A tájékoztató módosítása">
          <p>
            Amennyiben a Weboldalon kezelt adatok köre vagy célja bővül (például hírlevél
            bevezetésével), jelen tájékoztatót frissítjük, és a Weboldalon közzétesszük annak
            aktuális, hatályos verzióját.
          </p>
        </Section>
      </section>
    </div>
  );
}
