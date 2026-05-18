"use client";

import { useI18n } from "@/lib/i18n";
import { parseAccordionHash, scrollToAccordionTarget } from "@/lib/utils";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const SERVICE_KEYS = [
  "s1",
  "s2",
  "s3",
  "s4",
  "s5",
  "s6",
  "s7",
  "s8",
  "s9",
  "s10",
] as const;

type ServiceKey = (typeof SERVICE_KEYS)[number];

function serviceKeyFromHash(): ServiceKey | null {
  const n = parseAccordionHash(window.location.hash);
  if (n == null || n > SERVICE_KEYS.length) return null;
  return SERVICE_KEYS[n - 1];
}
function scrollToService(n: number) {
  const target = document.getElementById(`acc-trigger-${n}`);
  const navbar = document.getElementById("navbar");
  if (!target || !navbar) return;
  const run = () => scrollToAccordionTarget(target, navbar);
  run();
  requestAnimationFrame(run);
  window.setTimeout(run, 320);
}

export function ServicesAccordion() {
  const { t } = useI18n();
  const [open, setOpen] = useState("s1");
  const searchParams = useSearchParams();

  const applyHash = useCallback(() => {
    // In applyHash / mount effect:
    const n = getServiceIndex();
    if (n != null) {
      setOpen(SERVICE_KEYS[n - 1]);
      // Optional: canonical URL without duplicating hash (use replaceState, not Link)
      window.history.replaceState(null, "", `/services#acc-trigger-${n}`);
    }
  }, []);

  function getServiceIndex(): number | null {
    const fromQuery = searchParams.get("acc");
    if (fromQuery) {
      const n = Number(fromQuery);
      if (Number.isFinite(n) && n >= 1 && n <= SERVICE_KEYS.length) return n;
    }
    return parseAccordionHash(window.location.hash);
  }

  // Mount + in-page hash changes
  useEffect(() => {
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, [applyHash]);

  // Scroll only after the matching panel is open in the DOM
  useLayoutEffect(() => {
    const n = parseAccordionHash(window.location.hash);
    if (n == null) return;
    const key = SERVICE_KEYS[n - 1];
    if (open !== key) return;
    scrollToService(n);
  }, [open]);

  return (
    <div className="acc-list">
      {SERVICE_KEYS.map((key) => {
        const isOpen = open === key;
        const title = t(`srv.${key}.title`);
        const desc = t(`srv.${key}.desc`);
        // const label = t(`srv.${key}.label`);

        // Collect bullets — li1..li7 or sub1/sub2
        const bullets: string[] = [];
        for (let i = 1; i <= 7; i++) {
          const val = t(`srv.${key}.li${i}`);
          if (val !== `srv.${key}.li${i}`) bullets.push(val);
        }

        // Sub-sections (s3, s4, s9)
        const sub1Title = t(`srv.${key}.sub1.title`);
        const sub2Title = t(`srv.${key}.sub2.title`);
        const hasSubs = sub1Title !== `srv.${key}.sub1.title`;

        const sub1Bullets: string[] = [];
        const sub2Bullets: string[] = [];
        if (hasSubs) {
          for (let i = 1; i <= 7; i++) {
            const v1 = t(`srv.${key}.sub1.li${i}`);
            if (v1 !== `srv.${key}.sub1.li${i}`) sub1Bullets.push(v1);
            const v2 = t(`srv.${key}.sub2.li${i}`);
            if (v2 !== `srv.${key}.sub2.li${i}`) sub2Bullets.push(v2);
          }
        }

        return (
          <div
            key={key}
            className={`acc-item ${isOpen ? "is-open" : ""}`}
            id={`acc-trigger-${key.slice(1)}`}
          >
            <button
              className="acc-trigger"
              onClick={() => setOpen(isOpen ? "" : key)}
              aria-expanded={isOpen}
            >
              <div className="acc-trigger-left">
                <span className="acc-num">{key.replace("s", "")}</span>
                <span className="acc-title">{title}</span>
              </div>
            </button>
            <div className="acc-body">
              <div className="acc-body-inner">
                <div className="acc-body-content">
                  <p className="svc-desc">{desc}</p>

                  {!hasSubs && bullets.length > 0 && (
                    <>
                      {/* {label && label !== `srv.${key}.label` && (
                        <p className="svc-label">{label}</p>
                      )} */}
                      <ul className="service-list">
                        {bullets.map((b) => (
                          <li key={b}>{b}</li>
                        ))}
                      </ul>
                    </>
                  )}

                  {hasSubs && (
                    <div className="svc-sub-sections">
                      <div className="svc-sub">
                        <p className="svc-sub-title">{sub1Title}</p>
                        <ul className="service-list">
                          {sub1Bullets.map((b) => (
                            <li key={b}>{b}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="svc-sub">
                        <p className="svc-sub-title">{sub2Title}</p>
                        <ul className="service-list">
                          {sub2Bullets.map((b) => (
                            <li key={b}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
