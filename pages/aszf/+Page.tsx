const LAST_UPDATED = "2026. 11. 17.";

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
          Általános Szerződési Feltételek
        </h1>
        <p className="mt-4 text-sm text-white/60">Utolsó frissítés: {LAST_UPDATED}</p>
      </section>

      <section className="mx-auto w-full max-w-3xl space-y-10 px-6 pb-24" data-reveal>
        <Section title="1. Általános rendelkezések, a szolgáltató adatai">
          <p>
            Jelen Általános Szerződési Feltételek (a továbbiakban: ÁSZF) a Németh Szilveszter egyéni
            vállalkozó (a továbbiakban: Szolgáltató) által a synelweb.hu weboldalon keresztül kínált
            webfejlesztési szolgáltatásokra vonatkoznak. A Szolgáltató elérhetőségei és
            nyilvántartási adatai az Impresszum oldalon találhatók.
          </p>
        </Section>

        <Section title="2. A szolgáltatás tárgya">
          <p>
            A Szolgáltató egyedi igény szerinti webfejlesztési szolgáltatásokat nyújt (például
            landing oldal, céges weboldal, webshop, egyedi funkciók fejlesztése), valamint az
            elkészült weboldalak üzemeltetését és karbantartását, továbbá Google keresőhirdetések
            (Google Ads) beállítását és kezelését vállalja. A szolgáltatás konkrét tartalmát és
            terjedelmét minden esetben a felekkel egyeztetett, egyedi ajánlat határozza meg.
          </p>
          <p>
            A Weboldalon emellett ingyenes, tájékoztató jellegű weboldal-ellenőrző eszköz is
            elérhető, amelyre a 8. pont vonatkozik.
          </p>
        </Section>

        <Section title="3. A megrendelés menete">
          <p>
            A megrendelés a Weboldalon található elérhetőségeken (e-mail, telefon, ajánlatkérő
            űrlap) történő egyeztetéssel indul. Az ajánlatkérő űrlap kitöltése nem minősül
            megrendelésnek, és szerződést nem hoz létre. A Szolgáltató a megbeszélt igények alapján
            egyedi árajánlatot készít. A szerződés a Megrendelő általi írásos (e-mailes)
            visszaigazolással, illetve az esetleges előleg megfizetésével jön létre.
          </p>
        </Section>

        <Section title="4. Árak és fizetési feltételek">
          <p>
            A Weboldalon feltüntetett árak tájékoztató jellegűek, a végleges díjazást minden esetben
            az egyedi ajánlat tartalmazza. Az árak forintban (HUF), euróban (EUR) vagy amerikai
            dollárban (USD) is megjeleníthetők; a nem forintban megjelenített árak a forintár napi
            árfolyamon átszámított, kerekített értékei, ezért időről időre változhatnak. A fizetés
            pénzneme és összege az ajánlatban kerül rögzítésre. A Szolgáltató a munka megkezdése
            előtt előleget kérhet, a fennmaradó összeg a teljesítést követően esedékes. A pontos
            fizetési ütemezést az egyedi ajánlat/szerződés tartalmazza.
          </p>
        </Section>

        <Section title="5. Teljesítés, határidők">
          <p>
            A teljesítés határideje az egyedi ajánlatban/szerződésben kerül rögzítésre. A határidő a
            felek közös egyeztetésével módosítható, különösen, ha a Megrendelő késedelmesen
            szolgáltat adatot, tartalmat vagy visszajelzést a fejlesztés során.
          </p>
        </Section>

        <Section title="6. Üzemeltetés és karbantartás">
          <p>
            Az elkészült weboldal üzemeltetését és karbantartását (különösen a tárhelyet és a
            szervereket, az adatbázist, a biztonsági frissítéseket és a műszaki felügyeletet) az
            átadást követően is a Szolgáltató végzi. Az üzemeltetés minden projekt része, havi díj
            ellenében; a díj mértékét, tartalmát és a felmondás feltételeit az egyedi ajánlat,
            illetve a szerződés tartalmazza.
          </p>
        </Section>

        <Section title="7. Google keresőhirdetés (Google Ads) kezelése">
          <p>
            A Szolgáltató a hirdetési kampányt a tőle elvárható szakmai gondossággal állítja be és
            kezeli (kulcsszókutatás, kampányfelépítés, konverziómérés, rendszeres optimalizálás és
            havi riport). A hirdetések eredménye a keresési kereslettől, a versenytől, a Megrendelő
            ajánlatától és árazásától, valamint a beérkező megkeresések kezelésétől is függ, ezért a
            Szolgáltató meghatározott számú új ügyfelet, megkeresést vagy megtérülést nem garantál.
          </p>
          <p>
            A hirdetési költést (a Google felé fizetendő kattintási díjakat) a Megrendelő
            közvetlenül a Google-nek fizeti a saját hirdetési fiókjából; ez nem része a Szolgáltató
            díjának. A hirdetési fiók a Megrendelő tulajdona, a Szolgáltató kezelői hozzáféréssel
            dolgozik benne. A hirdetési fiók beállításáért egyszeri díj csak akkor fizetendő, ha a
            Megrendelőnek még nincs fiókja; a havi kezelési díjat a kampány mérete alapján az egyedi
            ajánlat rögzíti. A kampány első 4–6 hete tanulási időszak.
          </p>
          <p>
            Csomagakció: ha a Megrendelő a hirdetéskezelést weboldal-fejlesztéssel együtt rendeli
            meg, a hirdetési fiók beállításáért egyszeri díjat nem kell fizetnie. Az akció
            visszavonásig érvényes; visszavonása a már elfogadott ajánlatokat nem érinti.
          </p>
          <p>
            A hirdetésekre a Google hirdetési irányelvei és szerződési feltételei is vonatkoznak. A
            Szolgáltató nem felel a Google döntéseiért (például hirdetések elutasításáért, a fiók
            felfüggesztéséért), valamint a Google által felszámított díjakért és adókért.
          </p>
        </Section>

        <Section title="8. Ingyenes weboldal-ellenőrzés">
          <p>
            A Weboldalon elérhető weboldal-ellenőrző eszköz ingyenes, tájékoztató jellegű
            szolgáltatás. A mérést a Google PageSpeed Insights szolgáltatása végzi; az eredmények
            mérésről mérésre eltérhetnek, és nem minősülnek szakvéleménynek vagy garanciának. A
            Szolgáltató nem felel az eredmények alapján hozott döntésekért, valamint az eszköz
            elérhetetlenségéért vagy hibáiért.
          </p>
          <p>
            Az eszközzel csak nyilvánosan elérhető weboldalak ellenőrizhetők. A visszaélések
            megelőzése érdekében a mérések száma korlátozott. Az eredményről letölthető PDF riportot
            a felhasználó saját céljára szabadon felhasználhatja.
          </p>
        </Section>

        <Section title="9. Elállás, felmondás">
          <p>
            Mivel a nyújtott szolgáltatás a Megrendelő egyedi igényei szerint készül, a fogyasztó és
            a vállalkozás közötti szerződések részletes szabályairól szóló 45/2014. (II. 26.) Korm.
            rendelet 29. § (1) bekezdés a) pontja alapján a fogyasztót nem illeti meg az elállási
            jog, ha a Szolgáltató a teljesítést a Megrendelő kifejezett, előzetes beleegyezésével
            már megkezdte. A teljesítés megkezdése előtt a Megrendelőt elállási jog illeti meg, ezt
            írásban (e-mailben) gyakorolhatja.
          </p>
        </Section>

        <Section title="10. Szavatosság, felelősség">
          <p>
            A Szolgáltató a tőle elvárható szakmai gondossággal végzi a fejlesztést. A Szolgáltató
            felelőssége nem terjed ki a Megrendelő által szolgáltatott (szöveges, képi) tartalom
            jogtisztaságáért, valamint a harmadik felek által nyújtott szolgáltatások (például
            tárhely, domain, Google-szolgáltatások) hibáiért és üzemszüneteiért.
          </p>
        </Section>

        <Section title="11. Szerzői jogok">
          <p>
            A teljesítés és a teljes díj kiegyenlítése után a Megrendelő jogosulttá válik az
            elkészült weboldal saját célú felhasználására. A fejlesztés során felhasznált, harmadik
            féltől származó elemek (pl. nyílt forráskódú könyvtárak, betűtípusok, képek) a saját
            licencfeltételeik szerint használhatók.
          </p>
        </Section>

        <Section title="12. Panaszkezelés, jogorvoslat">
          <p>
            A Megrendelő panaszával az info@synelweb.hu e-mail címen fordulhat a Szolgáltatóhoz.
            Amennyiben a panasz rendezése nem vezet eredményre, a Megrendelő a lakóhelye szerint
            illetékes békéltető testülethez, illetve az Európai Bizottság online vitarendezési
            platformjához (
            <a
              href="https://ec.europa.eu/consumers/odr"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4"
            >
              ec.europa.eu/consumers/odr
            </a>
            ) fordulhat.
          </p>
        </Section>

        <Section title="13. Irányadó jog">
          <p>
            A jelen ÁSZF-ben nem szabályozott kérdésekben a magyar jog, különösen a Polgári
            Törvénykönyvről szóló 2013. évi V. törvény és a fogyasztóvédelemre vonatkozó
            jogszabályok rendelkezései az irányadók.
          </p>
        </Section>

        <Section title="14. Az ÁSZF módosítása">
          <p>
            A Szolgáltató jogosult jelen ÁSZF-et egyoldalúan módosítani, a módosítás a Weboldalon
            történő közzétételtől hatályos. A módosítás a már megkötött szerződéseket nem érinti.
          </p>
        </Section>
      </section>
    </div>
  );
}
