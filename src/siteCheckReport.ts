import type { TFunction } from "i18next";
import {
  auditItemHelp,
  describeAuditItem,
  describePlatform,
  sortAuditItems,
} from "@/src/siteCheckAudit";
import type { SiteCheckResult } from "@/src/services/siteCheckService";
import type { AppLang } from "@/src/services/serviceCardsService";

// A branded A4 PDF of a website check, built in the browser. jsPDF and the
// fonts (TTF copies of the site's Geist and Orbitron, with Hungarian ő/ű)
// load only when someone asks for a report.

const COLORS = {
  surface: [11, 15, 25],
  warm: [245, 158, 11],
  hot: [244, 63, 94],
  accent: [255, 0, 127],
  text: [30, 34, 45],
  muted: [110, 116, 130],
  line: [225, 228, 235],
  good: [16, 185, 129],
  average: [245, 158, 11],
  poor: [244, 63, 94],
} as const;

const FONTS = [
  { file: "geist-1.8.2-regular.ttf", family: "Geist", style: "normal" },
  { file: "geist-1.8.2-bold.ttf", family: "Geist", style: "bold" },
  { file: "orbitron-5.2.8-600.ttf", family: "Orbitron", style: "normal" },
] as const;

const SCORE_KEYS = ["performance", "accessibility", "bestPractices", "seo"] as const;

function toBase64(buffer: ArrayBuffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(binary);
}

function tone(score: number) {
  return score >= 90 ? COLORS.good : score >= 50 ? COLORS.average : COLORS.poor;
}

function locale(lang: AppLang) {
  return lang === "en" ? "en-US" : lang === "de" ? "de-DE" : "hu-HU";
}

function host(url: string) {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export async function downloadSiteCheckReport(
  result: SiteCheckResult,
  t: TFunction,
  lang: AppLang,
  checkedAt: Date = new Date()
) {
  const [{ jsPDF }, ...fonts] = await Promise.all([
    import("jspdf"),
    ...FONTS.map((font) =>
      fetch(`/fonts/pdf/${font.file}`).then((response) => response.arrayBuffer())
    ),
  ]);

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  FONTS.forEach((font, index) => {
    doc.addFileToVFS(font.file, toBase64(fonts[index]));
    doc.addFont(font.file, font.family, font.style);
  });

  const pageWidth = 210;
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let y = 0;

  const setColor = (rgb: readonly number[]) => doc.setTextColor(rgb[0], rgb[1], rgb[2]);
  const text = (
    value: string,
    x: number,
    size: number,
    options: {
      bold?: boolean;
      color?: readonly number[];
      align?: "left" | "right" | "center";
      maxWidth?: number;
    } = {}
  ) => {
    doc.setFont("Geist", options.bold ? "bold" : "normal");
    doc.setFontSize(size);
    setColor(options.color ?? COLORS.text);
    const lines = options.maxWidth ? doc.splitTextToSize(value, options.maxWidth) : [value];
    doc.text(lines, x, y, { align: options.align ?? "left" });
    return lines.length;
  };
  const sectionTitle = (title: string) => {
    y += 9;
    text(title, margin, 12, { bold: true });
    y += 2.5;
    doc.setDrawColor(COLORS.line[0], COLORS.line[1], COLORS.line[2]);
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;
  };

  // Header: the wordmark on the brand's dark surface.
  doc.setFillColor(COLORS.surface[0], COLORS.surface[1], COLORS.surface[2]);
  doc.rect(0, 0, pageWidth, 28, "F");
  doc.setFillColor(COLORS.accent[0], COLORS.accent[1], COLORS.accent[2]);
  doc.rect(0, 28, pageWidth, 1.2, "F");
  doc.setFont("Orbitron", "normal");
  doc.setFontSize(20);
  setColor(COLORS.warm);
  doc.text("SYNELWEB", margin, 17.5, { charSpace: 1.2 });
  y = 13;
  text(t("siteCheck.pdf.title"), pageWidth - margin, 10, {
    color: [255, 255, 255],
    align: "right",
    bold: true,
  });
  y = 19;
  text("synelweb.hu", pageWidth - margin, 8.5, { color: [200, 205, 215], align: "right" });

  // What was checked.
  y = 42;
  text(
    t("siteCheck.resultFor", {
      host: host(result.finalUrl || result.url),
      device: t(`siteCheck.strategy.${result.strategy}`),
    }),
    margin,
    18,
    { bold: true }
  );
  y += 6.5;
  text(result.finalUrl || result.url, margin, 9, { color: COLORS.muted });
  y += 5;
  text(
    t("siteCheck.pdf.checkedAt", {
      date: checkedAt.toLocaleString(locale(lang), { dateStyle: "long", timeStyle: "short" }),
    }),
    margin,
    9,
    { color: COLORS.muted }
  );

  const performance = result.scores.performance;
  if (performance !== null) {
    y += 8;
    const verdict = performance >= 90 ? "good" : performance >= 50 ? "average" : "poor";
    text(t(`siteCheck.verdict.${verdict}`), margin, 11, { maxWidth: contentWidth });
  }

  // Four score circles in Lighthouse's colours.
  y += 12;
  const cellWidth = contentWidth / SCORE_KEYS.length;
  SCORE_KEYS.forEach((key, index) => {
    const score = result.scores[key] ?? 0;
    const cx = margin + cellWidth * index + cellWidth / 2;
    const color = tone(score);
    doc.setDrawColor(COLORS.line[0], COLORS.line[1], COLORS.line[2]);
    doc.setLineWidth(2.2);
    doc.circle(cx, y + 9, 9, "S");
    doc.setDrawColor(color[0], color[1], color[2]);
    doc.circle(cx, y + 9, 9, "S");
    doc.setLineWidth(0.2);
    const saved = y;
    y = saved + 11.5;
    text(String(score), cx, 15, { bold: true, color, align: "center" });
    y = saved + 25;
    text(t(`siteCheck.scores.${key}`), cx, 8.5, { color: COLORS.muted, align: "center" });
    y = saved;
  });
  y += 27;

  sectionTitle(t("siteCheck.fieldTitle"));
  if (result.field.length > 0) {
    for (const metric of result.field) {
      const value =
        metric.id === "lcp"
          ? `${(metric.percentile / 1000).toLocaleString(locale(lang), { maximumFractionDigits: 1 })} s`
          : metric.id === "inp"
            ? `${metric.percentile} ms`
            : (metric.percentile / 100).toLocaleString(locale(lang), { maximumFractionDigits: 2 });
      text(t(`siteCheck.fieldMetrics.${metric.id}`), margin, 10);
      text(
        `${value}  ·  ${t(`siteCheck.fieldCategory.${metric.category}`, { defaultValue: metric.category })}`,
        pageWidth - margin,
        10,
        {
          bold: true,
          align: "right",
          color:
            metric.category === "FAST"
              ? COLORS.good
              : metric.category === "SLOW"
                ? COLORS.poor
                : COLORS.average,
        }
      );
      y += 6.5;
    }
  } else {
    y +=
      text(t("siteCheck.fieldNone"), margin, 10, { color: COLORS.muted, maxWidth: contentWidth }) *
      4.5;
  }

  if (result.lab.length > 0) {
    sectionTitle(t("siteCheck.labTitle"));
    for (const metric of result.lab) {
      text(metric.title, margin, 10);
      const color =
        metric.score === null
          ? COLORS.text
          : metric.score >= 0.9
            ? COLORS.good
            : metric.score >= 0.5
              ? COLORS.average
              : COLORS.poor;
      text(metric.value, pageWidth - margin, 10, { bold: true, align: "right", color });
      y += 6.5;
    }
  }

  sectionTitle(t("siteCheck.opportunitiesTitle"));
  if (result.opportunities.length > 0) {
    result.opportunities.forEach((item, index) => {
      const label =
        item.savingsMs >= 100
          ? t("siteCheck.savings", {
              seconds: (item.savingsMs / 1000).toLocaleString(locale(lang), {
                maximumFractionDigits: 1,
              }),
            })
          : (item.clsSavings ?? 0) > 0
            ? t("siteCheck.clsSavings")
            : t("siteCheck.genericSavings");
      const lines = text(`${index + 1}. ${item.title}`, margin, 10, {
        bold: true,
        maxWidth: contentWidth,
      });
      y += lines * 4.6;
      text(label, margin + 4, 9, { color: COLORS.warm });
      y += 7;
    });
  } else {
    const key =
      (performance ?? 0) >= 90 ? "siteCheck.noOpportunities" : "siteCheck.noOpportunitiesWeak";
    text(t(key), margin, 10, { color: COLORS.muted, maxWidth: contentWidth });
  }

  // The SEO basics and technical details on their own page(s).
  const auditSections = [
    { group: "seo" as const, items: result.seo?.checks ?? [], title: "siteCheck.audit.seoTitle" },
    {
      group: "privacy" as const,
      items: result.seo?.privacy ?? [],
      title: "siteCheck.audit.privacyTitle",
    },
    { group: "tech" as const, items: result.tech ?? [], title: "siteCheck.audit.techTitle" },
  ].filter((section) => section.items.length > 0);
  const drawFooter = () => {
    const top = 297 - 34;
    doc.setFillColor(COLORS.surface[0], COLORS.surface[1], COLORS.surface[2]);
    doc.rect(0, top, pageWidth, 34, "F");
    const saved = y;
    y = top + 10;
    text(t("siteCheck.cta.title"), margin, 12, { bold: true, color: [255, 255, 255] });
    y += 6.5;
    text(t("siteCheck.pdf.contact"), margin, 9.5, { color: COLORS.warm });
    y += 9;
    text(t("siteCheck.pdf.footerNote"), margin, 7.5, {
      color: [160, 166, 180],
      maxWidth: contentWidth,
    });
    y = saved;
  };
  if (auditSections.length > 0) {
    drawFooter();
    doc.addPage();
    y = 12;
    const statusColor: Record<string, readonly number[]> = {
      pass: [16, 150, 100],
      warn: COLORS.warm,
      fail: [205, 45, 60],
      info: COLORS.muted,
    };
    // The loading filmstrip (JPEG/PNG frames), with the time of each frame.
    const frames = (result.screenshots?.filmstrip ?? []).filter((frame) =>
      /^data:image\/(jpeg|png);base64,/.test(frame.data)
    );
    if (frames.length > 0) {
      sectionTitle(t(`siteCheck.audit.shotsTitle.${result.strategy}`));
      const gap = 3;
      const width = (contentWidth - gap * (frames.length - 1)) / frames.length;
      let tallest = 0;
      frames.forEach((frame, index) => {
        try {
          const { width: w, height: h } = doc.getImageProperties(frame.data);
          const height = Math.min((h / w) * width, 60);
          tallest = Math.max(tallest, height);
          const format = frame.data.startsWith("data:image/png") ? "PNG" : "JPEG";
          const x = margin + index * (width + gap);
          doc.addImage(frame.data, format, x, y, width, height);
          // A frame: a still-blank page would vanish on the white paper.
          doc.setDrawColor(COLORS.line[0], COLORS.line[1], COLORS.line[2]);
          doc.rect(x, y, width, height);
        } catch {
          // A frame the PDF library can't read is left out.
        }
      });
      y += tallest + 4;
      frames.forEach((frame, index) => {
        text(
          t("siteCheck.audit.frameAt", {
            seconds: (frame.timing / 1000).toLocaleString(locale(lang), {
              maximumFractionDigits: 1,
            }),
          }),
          margin + index * (width + gap) + width / 2,
          7.5,
          { color: COLORS.muted, align: "center" }
        );
      });
      y += 3;
    }
    const platform = result.seo?.platform;
    if (platform) {
      const { headline, note } = describePlatform(platform, t);
      sectionTitle(t("siteCheck.audit.platform.title"));
      const lines = text(headline, margin, 10, { bold: true, maxWidth: contentWidth });
      y += lines * 4.6;
      if (note) {
        const noteLines = text(note, margin, 8.5, { color: COLORS.muted, maxWidth: contentWidth });
        y += noteLines * 4;
      }
      text(t("siteCheck.audit.platform.disclaimer"), margin, 7.5, { color: COLORS.muted });
      y += 2;
    }
    for (const section of auditSections) {
      sectionTitle(t(section.title));
      for (const item of sortAuditItems(section.items)) {
        const described = describeAuditItem(section.group, item, t, lang);
        if (!described) continue;
        if (y > 297 - 46) {
          drawFooter();
          doc.addPage();
          y = 18;
        }
        text(`${t(`siteCheck.audit.status.${item.status}`)}`, margin, 8.5, {
          bold: true,
          color: statusColor[item.status],
        });
        text(described.label, margin + 22, 9.5, { bold: true });
        y += 4.6;
        const lines = text(described.message, margin + 22, 8.5, {
          color: COLORS.muted,
          maxWidth: contentWidth - 22,
        });
        y += lines * 4;
        // What a problem means, for whoever reads the report later.
        const help =
          item.status === "fail" || item.status === "warn"
            ? auditItemHelp(section.group, item, t)
            : "";
        if (help) {
          const helpLines = text(help, margin + 22, 7.5, {
            color: [120, 126, 140],
            maxWidth: contentWidth - 22,
          });
          y += helpLines * 3.6;
        }
        y += 2.6;
      }
    }
  }

  // Footer: the offer and how to get in touch.
  const footerTop = 297 - 34;
  doc.setFillColor(COLORS.surface[0], COLORS.surface[1], COLORS.surface[2]);
  doc.rect(0, footerTop, pageWidth, 34, "F");
  y = footerTop + 10;
  text(t("siteCheck.cta.title"), margin, 12, { bold: true, color: [255, 255, 255] });
  y += 6.5;
  text(t("siteCheck.pdf.contact"), margin, 9.5, { color: COLORS.warm });
  y += 9;
  text(t("siteCheck.pdf.footerNote"), margin, 7.5, {
    color: [160, 166, 180],
    maxWidth: contentWidth,
  });

  const date = checkedAt.toISOString().slice(0, 10);
  doc.save(
    `synelweb-${host(result.url).replace(/[^a-z0-9.-]/gi, "-")}-${result.strategy}-${date}.pdf`
  );
}
