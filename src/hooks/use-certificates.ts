import { useEffect, useState } from "react";
import { getCertificates, type Certificate } from "@/src/services/certificatesService";
import type { AppLang } from "@/src/services/serviceCardsService";

// Certificates baked into the prerendered page, refreshed in the browser so a
// stale or failed build-time fetch heals itself (same as the projects list).
export function useCertificates(lang: AppLang, initial: Certificate[] = []): Certificate[] {
  const [certificates, setCertificates] = useState<Certificate[]>(initial);

  useEffect(() => {
    let isMounted = true;
    getCertificates(lang)
      .then((fresh) => {
        if (isMounted) setCertificates(fresh);
      })
      .catch(() => {
        // Keep what was prerendered.
      });
    return () => {
      isMounted = false;
    };
  }, [lang]);

  return certificates;
}

// Exam-based certificates first (they carry more weight than completed
// courses), then the newest.
export function strongestFirst(certificates: Certificate[]): Certificate[] {
  return [...certificates].sort((a, b) => {
    if (a.kind !== b.kind) return a.kind === "exam" ? -1 : 1;
    return b.issuedOn.localeCompare(a.issuedOn);
  });
}
