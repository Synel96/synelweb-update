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
            landing oldal, céges weboldal, webshop, egyedi funkciók fejlesztése), a szolgáltatás
            konkrét tartalmát és terjedelmét minden esetben a felekkel egyeztetett, egyedi ajánlat
            határozza meg.
          </p>
        </Section>

        <Section title="3. A megrendelés menete">
          <p>
            A megrendelés a Weboldalon található elérhetőségeken (e-mail, telefon,
            kapcsolatfelvételi űrlap) történő egyeztetéssel indul. A Szolgáltató a megbeszélt
            igények alapján egyedi árajánlatot készít. A szerződés a Megrendelő általi írásos
            (e-mailes) visszaigazolással, illetve az esetleges előleg megfizetésével jön létre.
          </p>
        </Section>

        <Section title="4. Árak és fizetési feltételek">
          <p>
            A Weboldalon feltüntetett árak tájékoztató jellegűek, a végleges díjazást minden esetben
            az egyedi ajánlat tartalmazza. Az árak forintban (HUF), euróban (EUR) vagy amerikai
            dollárban (USD) is megjeleníthetők; a fizetés pénzneme az ajánlatban kerül rögzítésre. A
            Szolgáltató a munka megkezdése előtt előleget kérhet, a fennmaradó összeg a teljesítést
            követően esedékes. A pontos fizetési ütemezést az egyedi ajánlat/szerződés tartalmazza.
          </p>
        </Section>

        <Section title="5. Teljesítés, határidők">
          <p>
            A teljesítés határideje az egyedi ajánlatban/szerződésben kerül rögzítésre. A határidő a
            felek közös egyeztetésével módosítható, különösen, ha a Megrendelő késedelmesen
            szolgáltat adatot, tartalmat vagy visszajelzést a fejlesztés során.
          </p>
        </Section>

        <Section title="6. Elállás, felmondás">
          <p>
            Mivel a nyújtott szolgáltatás a Megrendelő egyedi igényei szerint készül, a fogyasztó és
            a vállalkozás közötti szerződések részletes szabályairól szóló 45/2014. (II. 26.) Korm.
            rendelet 29. § (1) bekezdés a) pontja alapján a fogyasztót nem illeti meg az elállási
            jog, ha a Szolgáltató a teljesítést a Megrendelő kifejezett, előzetes beleegyezésével
            már megkezdte. A teljesítés megkezdése előtt a Megrendelőt elállási jog illeti meg, ezt
            írásban (e-mailben) gyakorolhatja.
          </p>
        </Section>

        <Section title="7. Szavatosság, felelősség">
          <p>
            A Szolgáltató a tőle elvárható szakmai gondossággal végzi a fejlesztést. A Szolgáltató
            felelőssége nem terjed ki a Megrendelő által szolgáltatott (szöveges, képi) tartalom
            jogtisztaságáért, valamint a Megrendelő által harmadik féltől igénybe vett
            szolgáltatások (pl. tárhely, domain) hibáiért.
          </p>
        </Section>

        <Section title="8. Szerzői jogok">
          <p>
            A teljesítés és a teljes díj kiegyenlítése után a Megrendelő jogosulttá válik az
            elkészült weboldal saját célú felhasználására. A fejlesztés során felhasznált, harmadik
            féltől származó elemek (pl. nyílt forráskódú könyvtárak, betűtípusok, képek) a saját
            licencfeltételeik szerint használhatók.
          </p>
        </Section>

        <Section title="9. Panaszkezelés, jogorvoslat">
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

        <Section title="10. Irányadó jog">
          <p>
            A jelen ÁSZF-ben nem szabályozott kérdésekben a magyar jog, különösen a Polgári
            Törvénykönyvről szóló 2013. évi V. törvény és a fogyasztóvédelemre vonatkozó
            jogszabályok rendelkezései az irányadók.
          </p>
        </Section>

        <Section title="11. Az ÁSZF módosítása">
          <p>
            A Szolgáltató jogosult jelen ÁSZF-et egyoldalúan módosítani, a módosítás a Weboldalon
            történő közzétételtől hatályos. A módosítás a már megkötött szerződéseket nem érinti.
          </p>
        </Section>
      </section>
    </div>
  );
}
