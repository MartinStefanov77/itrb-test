"use client";

import { useI18n } from "@/lib/i18n";
import Image from "next/image";
import { useEffect, useRef } from "react";

const DESKTOP_MQ = "(min-width: 1025px)";

export function OurEdgeSectionContent() {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const cards = Array.from(
      section.querySelectorAll<HTMLElement>(".edge-card")
    );
    if (!cards.length) return;

    const desktopMq = window.matchMedia(DESKTOP_MQ);

    const resetCardHeights = () => {
      cards.forEach((card) => {
        card.style.height = "";
      });
    };

    const applyEqualHeight = () => {
      resetCardHeights();

      if (!desktopMq.matches) return;

      const maxHeight = cards.reduce(
        (max, card) => Math.max(max, card.offsetHeight),
        0
      );

      cards.forEach((card) => {
        card.style.height = `${maxHeight}px`;
      });
    };

    window.addEventListener("load", applyEqualHeight);
    window.addEventListener("resize", applyEqualHeight);
    window.addEventListener("orientationchange", applyEqualHeight);
    desktopMq.addEventListener("change", applyEqualHeight);

    applyEqualHeight();

    return () => {
      window.removeEventListener("load", applyEqualHeight);
      window.removeEventListener("resize", applyEqualHeight);
      window.removeEventListener("orientationchange", applyEqualHeight);
      desktopMq.removeEventListener("change", applyEqualHeight);
      resetCardHeights();
    };
  }, []);

  return (
    <section ref={sectionRef} id="our-edge" className={`section edge-board`}>
      <div className="container">
        <div className="home-two-col home-edge-layout">
          <div className="home-two-col-text home-edge-intro reveal-left">
            <div className="section-header">
              <h2 className="section-heading">{t("home.edge.heading")}</h2>
            </div>
          </div>

          <article className="edge-card edge-card-image reveal-up">
            <div className="edge-card-image">
              <Image
                src="/images/e-image01.jpg"
                alt="Architecture"
                width={435}
                height={220}
              />
            </div>
            <div className="edge-card-content">
              <h3 className="edge-title">{t("home.edge.e1.title")}</h3>
              <p className="edge-desc">{t("home.edge.e1.desc")}</p>
            </div>
          </article>

          <article className="edge-card edge-card-image reveal-up">
            <div className="edge-card-image">
              <Image
                src="/images/e-image02.jpg"
                alt="Regulatory alignment"
                width={435}
                height={220}
              />
            </div>
            <div className="edge-card-content">
              <h3 className="edge-title">{t("home.edge.e4.title")}</h3>
              <p className="edge-desc">{t("home.edge.e4.desc")}</p>
            </div>
          </article>
          <article className="edge-card edge-card-image reveal-up">
            <div className="edge-card-image">
              <Image
                src="/images/hero-services.webp"
                alt="Enterprise"
                width={435}
                height={220}
              />
            </div>
            <div className="edge-card-content">
              <h3 className="edge-title">{t("home.edge.e2.title")}</h3>
              <p className="edge-desc">{t("home.edge.e2.desc")}</p>
            </div>
          </article>

          <article className="edge-card edge-card-image reveal-up">
            <div className="edge-card-image">
              <Image
                src="/images/e-image05.jpg"
                alt="Engineering-led delivery"
                width={435}
                height={220}
              />
            </div>
            <div className="edge-card-content">
              <h3 className="edge-title">{t("home.edge.e6.title")}</h3>
              <p className="edge-desc">{t("home.edge.e6.desc")}</p>
            </div>
          </article>

          <article className="edge-card edge-card-image reveal-up">
            <div className="edge-card-image">
              <Image
                src="/images/hero-about.webp"
                alt="Hybrid specialization"
                width={435}
                height={220}
              />
            </div>
            <div className="edge-card-content">
              <h3 className="edge-title">{t("home.edge.e3.title")}</h3>
              <p className="edge-desc">{t("home.edge.e3.desc")}</p>
            </div>
          </article>

          <article className="edge-card edge-card-image reveal-up">
            <div className="edge-card-image">
              <Image
                src="/images/e-image03.jpg"
                alt="Lifecycle ownership"
                width={435}
                height={220}
              />
            </div>
            <div className="edge-card-content">
              <h3 className="edge-title">{t("home.edge.e5.title")}</h3>
              <p className="edge-desc">{t("home.edge.e5.desc")}</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
