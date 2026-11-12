import type { RegionalLogicalPath } from "@/src/localizedRoutes";

// Copy for the regional landing pages. Each page targets one market in one
// language, so the text lives here rather than in the (three-language)
// locale files.

export type RegionalBenefitIcon = "meet" | "languages" | "map" | "gauge" | "legal" | "euro";

export type RegionalContent = {
  eyebrow: string;
  title: string;
  intro: string;
  introStrong: string;
  ctaButton: string;
  benefitsLabel: string;
  benefitsTitle: string;
  benefits: Array<{ icon: RegionalBenefitIcon; title: string; text: string }>;
  referenceLabel: string;
  referenceTitle: string;
  referenceText: string;
  referenceLink: string;
  referenceScoresLabel: string;
  servicesLabel: string;
  servicesTitle: string;
  servicesText: string;
  servicesLink: string;
  perMonth: string;
  areasLabel: string;
  areasTitle: string;
  areas: string[];
  // Schema.org areaServed: the places the page is about.
  areasServed: string[];
  faqTitle: string;
  faq: Array<{ q: string; a: string }>;
  finalTitle: string;
  finalText: string;
};

export const REGIONAL_CONTENT: Record<RegionalLogicalPath, RegionalContent> = {
  "/sopron": {
    eyebrow: "Sopron és környéke",
    title: "Weboldal készítés Sopronban",
    intro:
      "Soproni webfejlesztőként egyedi, villámgyors weboldalakat és webshopokat készítek helyi vállalkozásoknak – sablonok nélkül, személyes egyeztetéssel. Az általam írt kód már élesben bizonyított: a Google keresőben és a Google hivatalos méréseiben is.",
    introStrong:
      "Sopronban egy weboldalnak két piacon kell megállnia a helyét: a helyi ügyfelek és a határ túloldaláról érkező osztrák vendégek előtt is. Én mindkettőre építek.",
    ctaButton: "Kérek ajánlatot",
    benefitsLabel: "Miért helyben?",
    benefitsTitle: "Amit egy soproni vállalkozás kap tőlem",
    benefits: [
      {
        icon: "meet",
        title: "Személyes egyeztetés",
        text: "Személyesen is leülünk: Sopronban és környékén, de egy megbeszélésre szívesen elutazom hozzád messzebbre is. Átbeszéljük a céljaidat, élőben mutatom a terveket, és bármikor kérdezhetsz. Ha neked kényelmesebb, videóhívással is megy.",
      },
      {
        icon: "languages",
        title: "Magyar–német kétnyelvű oldal",
        text: "Sopronban a vendégek és ügyfelek jó része Ausztriából érkezik. Az oldalad magyarul és németül is igényesen szólal meg, mindkét nyelvre külön keresőoptimalizálással.",
      },
      {
        icon: "map",
        title: "Helyi SEO és Google Cégprofil",
        text: "Hogy megtaláljanak, amikor valaki a szolgáltatásodra és Sopronra keres rá: helyi kulcsszavak, beállított Google Cégprofil és megjelenés a térképes találatok között.",
      },
      {
        icon: "gauge",
        title: "Mérhetően gyors",
        text: "A Google saját mérőeszközein, a Lighthouse-on és a PageSpeed Insightson is kiemelkedő pontszámok – mobilon is, ahol a látogatóid többsége böngészik.",
      },
    ],
    referenceLabel: "Soproni referencia",
    referenceTitle: "AlphaDent – helyben, élesben bizonyítva",
    referenceText:
      "Egy soproni vállalkozás, amelynek a weboldalát én építettem. A pontszámokat a Google Lighthouse mérte.",
    referenceLink: "Megnézem élőben",
    referenceScoresLabel: "Lighthouse pontszámok (mobil)",
    servicesLabel: "Szolgáltatások és árak",
    servicesTitle: "Átlátható árak – helyi kedvezménnyel",
    servicesText:
      "Sopron és környéke vállalkozásainak kedvezményes árazással dolgozom: az alábbi listaárakból a helyi kedvezményt az ajánlatban kapod meg. A részleteket és a kiegészítőket a szolgáltatások oldalon látod.",
    servicesLink: "Összes szolgáltatás részletesen",
    perMonth: "/ hó",
    areasLabel: "Ahol személyesen is ott vagyok",
    areasTitle: "Sopron és vonzáskörzete",
    areas: [
      "Sopron",
      "Fertőrákos",
      "Balf",
      "Ágfalva",
      "Harka",
      "Kópháza",
      "Nagycenk",
      "Fertőd",
      "Kapuvár",
      "Győr",
    ],
    areasServed: ["Sopron", "Fertőd", "Kapuvár", "Győr"],
    faqTitle: "Gyakori kérdések",
    faq: [
      {
        q: "Mennyibe kerül egy weboldal Sopronban?",
        a: "A listaárakat a szolgáltatások oldalon látod, Sopron és környéke vállalkozásainak pedig kedvezményes árazással dolgozom. Az egyszerűsített ajánlatkérő űrlappal pár perc alatt kapsz konkrét, a kedvezményt is tartalmazó ajánlatot.",
      },
      {
        q: "Hol tudunk személyesen találkozni?",
        a: "Sopronban és a környező településeken személyesen, ahogy neked kényelmes – de egy megbeszélésre szívesen elutazom messzebbre is, ezt egyeztetjük. Ha az egyszerűbb, videóhívással (Google Meet) is megbeszélhetünk mindent.",
      },
      {
        q: "Tudsz német nyelvű oldalt is készíteni az osztrák vendégeknek?",
        a: "Igen. Az oldal magyarul és németül (igény szerint angolul is) elérhető, és mindkét nyelvre külön optimalizálom a keresőknek.",
      },
      {
        q: "Ki kezeli az oldalt, miután elkészült?",
        a: "Te magad, egy egyszerű admin felületen: szöveget, képet, árat pár kattintással módosíthatsz. Ha nem szeretnél ezzel foglalkozni, karbantartást is vállalok.",
      },
    ],
    finalTitle: "Beszéljük át személyesen, mire van szükséged",
    finalText:
      "Írd meg pár mondatban, mit szeretnél, és egyeztetünk egy időpontot Sopronban vagy online.",
  },
  "/austria": {
    eyebrow: "Burgenland & Wien",
    title: "Webdesign für Burgenland & Wien",
    intro:
      "Ich entwickle individuelle, blitzschnelle Websites und Onlineshops für Unternehmen im Burgenland und in Wien – ohne Baukasten, mit persönlicher Betreuung. Ich arbeite von Sopron aus, direkt an der Grenze: Zu einem persönlichen Treffen bin ich in rund 20 Minuten in Eisenstadt und in 40–50 Minuten in Wien.",
    introStrong:
      "Der Code, den ich schreibe, hat sich bereits live bewährt: in der Google-Suche und in Googles offiziellen Messungen. Genau das braucht eine Website, die sich gegen die Konkurrenz durchsetzen soll.",
    ctaButton: "Angebot anfordern",
    benefitsLabel: "Warum mit mir?",
    benefitsTitle: "Was Unternehmen im Burgenland und in Wien bekommen",
    benefits: [
      {
        icon: "meet",
        title: "Persönliche Termine",
        text: "Sopron liegt direkt an der Grenze: Für ein Gespräch komme ich gern ins Burgenland oder nach Wien. Wenn es dir lieber ist, besprechen wir alles per Videocall – auf Deutsch.",
      },
      {
        icon: "legal",
        title: "Impressum & DSGVO",
        text: "Impressum nach österreichischen Vorgaben (ECG, MedienG), Datenschutzerklärung und ein Cookie-Hinweis nur dort, wo er wirklich nötig ist – technisch sauber umgesetzt. Die rechtlichen Inhalte stimmen wir gemeinsam ab.",
      },
      {
        icon: "gauge",
        title: "Messbar schnell",
        text: "Herausragende Werte in Googles eigenen Messwerkzeugen, Lighthouse und PageSpeed Insights – auch auf dem Smartphone, wo die meisten deiner Besucher surfen.",
      },
      {
        icon: "euro",
        title: "Preise in Euro",
        text: "Transparente Preise in Euro und ein verbindliches Angebot vorab – ohne versteckte Kosten. Auf Wunsch auch mehrsprachig: Deutsch, Englisch und Ungarisch.",
      },
    ],
    referenceLabel: "Referenz aus der Region",
    referenceTitle: "AlphaDent – live bewährt, gleich hinter der Grenze",
    referenceText:
      "Ein Unternehmen aus Sopron, dessen Website ich gebaut habe. Die Werte hat Google Lighthouse gemessen.",
    referenceLink: "Live ansehen",
    referenceScoresLabel: "Lighthouse-Werte (mobil)",
    servicesLabel: "Leistungen & Preise",
    servicesTitle: "Transparente Preise in Euro",
    servicesText:
      "Alle Leistungen mit Details und Zusatzoptionen findest du auf der Leistungsseite.",
    servicesLink: "Alle Leistungen im Detail",
    perMonth: "/ Monat",
    areasLabel: "Persönlich vor Ort",
    areasTitle: "Burgenland und Wien",
    areas: [
      "Eisenstadt",
      "Neusiedl am See",
      "Mattersburg",
      "Oberpullendorf",
      "Rust",
      "Purbach",
      "Wien",
    ],
    areasServed: ["Burgenland", "Wien"],
    faqTitle: "Häufige Fragen",
    faq: [
      {
        q: "Was kostet eine Website?",
        a: "Die Preise findest du in Euro auf der Leistungsseite. Über das kurze Anfrageformular bekommst du in wenigen Minuten ein konkretes Angebot.",
      },
      {
        q: "Können wir uns persönlich treffen?",
        a: "Ja. Im Burgenland und in Wien komme ich nach Absprache gern vorbei – und für ein Gespräch reise ich auch gern etwas weiter. Wenn es einfacher ist, sprechen wir per Videocall (Google Meet).",
      },
      {
        q: "Ist die Zusammenarbeit mit einem Anbieter aus Ungarn unkompliziert?",
        a: "Ja. Wir kommunizieren auf Deutsch, die Zusammenarbeit läuft innerhalb der EU, und du bekommst vorab ein klares, schriftliches Angebot.",
      },
      {
        q: "Wer pflegt die Website danach?",
        a: "Du selbst, über eine einfache Admin-Oberfläche: Texte, Bilder und Preise änderst du mit wenigen Klicks. Wenn du dich nicht darum kümmern willst, übernehme ich auch die Wartung.",
      },
    ],
    finalTitle: "Lass uns über dein Projekt sprechen",
    finalText:
      "Schreib mir in ein paar Sätzen, was du brauchst – wir vereinbaren einen Termin im Burgenland, in Wien oder online.",
  },
};
