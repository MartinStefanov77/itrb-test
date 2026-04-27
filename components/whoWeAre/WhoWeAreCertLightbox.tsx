"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type CertLightboxProps = {
  certificates: string[];
  lang: string;
  children: (
    openAt: (index: number, trigger?: HTMLButtonElement | null) => void,
  ) => React.ReactNode;
};

const CERT_DEFS = [
  {
    src: "/images/certificates/2989-itrb-certificate-9001-en.jpg",
  },
  {
    src: "/images/certificates/2989-itrb-certificate-27001-en.jpg",
  },
  {
    src: "/images/certificates/2989-itrb-certificate-20000-en.jpg",
  },
  {
    src: "/images/certificates/3019-itrb-certificate-37001-en.jpg",
  },
];

export function WhoWeAreCertLightbox({
  certificates,
  lang,
  children,
}: CertLightboxProps) {
  const certList = useMemo(() => certificates ?? [], [certificates, lang]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);

  const certCount = Math.min(certList.length, CERT_DEFS.length);
  const clampedActiveIndex = Math.max(0, Math.min(activeIndex, certCount - 1));

  const close = useCallback(() => {
    setOpen(false);
  }, [lang]);

  const openAt = useCallback(
    (index: number, trigger?: HTMLButtonElement | null) => {
      if (certCount <= 0) return;
      lastTriggerRef.current = trigger ?? lastTriggerRef.current;
      const normalized = ((index % certCount) + certCount) % certCount;
      setActiveIndex(normalized);
      setOpen(true);
    },
    [certCount, lang],
  );

  const gotoPrev = useCallback(() => {
    if (certCount <= 0) return;
    setActiveIndex((i) => (i - 1 + certCount) % certCount);
  }, [certCount, lang]);

  const gotoNext = useCallback(() => {
    if (certCount <= 0) return;
    setActiveIndex((i) => (i + 1) % certCount);
  }, [certCount, lang]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const closeBtn = document.getElementById(
      "certLightboxClose",
    ) as HTMLButtonElement | null;
    closeBtn?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        gotoPrev();
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        gotoNext();
        return;
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [close, gotoNext, gotoPrev, open]);

  useEffect(() => {
    if (open) return;
    // Restore focus for accessibility (best-effort).
    lastTriggerRef.current?.focus?.();
  }, [open]);

  const activeCertLabel = certList[clampedActiveIndex] ?? "";

  if (certList.length <= 0) return null;

  return (
    <>
      {children(openAt)}
      <div
        id="certLightboxBackdrop"
        className={`cert-lightbox-backdrop ${open ? "active" : ""}`}
        aria-hidden={!open}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        <div
          className="cert-lightbox"
          role="dialog"
          aria-modal="true"
          aria-labelledby="certLightboxTitle"
        >
          <div className="cert-lightbox-top">
            <h2 id="certLightboxTitle" className="cert-lightbox-title">
              {activeCertLabel}
            </h2>
            <button
              type="button"
              className="modal-close cert-lightbox-close"
              id="certLightboxClose"
              onClick={close}
              aria-label="Close"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="cert-lightbox-toolbar">
            <button
              type="button"
              className="cert-lightbox-nav-btn"
              id="certLightboxPrev"
              onClick={gotoPrev}
              aria-label="Previous certificate"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <span
              className="cert-lightbox-counter"
              aria-live="polite"
            >{`${clampedActiveIndex + 1} / ${certCount}`}</span>

            <button
              type="button"
              className="cert-lightbox-nav-btn"
              id="certLightboxNext"
              onClick={gotoNext}
              aria-label="Next certificate"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

          <div className="cert-lightbox-body">
            <div className="cert-lightbox-img-wrap">
              <img
                id="certLightboxImg"
                className="cert-lightbox-img"
                src={CERT_DEFS[clampedActiveIndex]?.src}
                alt={activeCertLabel}
                width={1200}
                height={1600}
                decoding="async"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
              />
            </div>

            <div
              className="cert-lightbox-thumbs"
              id="certLightboxThumbs"
              role="group"
              aria-label="All certificates"
            >
              {Array.from({ length: certCount }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`cert-lightbox-thumb ${i === clampedActiveIndex ? "is-active" : ""}`}
                  aria-pressed={i === clampedActiveIndex}
                  onClick={() => setActiveIndex(i)}
                >
                  <img src={CERT_DEFS[i]?.src} alt="" draggable={false} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
