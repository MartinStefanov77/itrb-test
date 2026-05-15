"use client";

import { useI18n } from "@/lib/i18n";
import styles from "./HeroSection.module.scss";
import Link from "next/link";

export function HeroSectionContent() {
  const { t } = useI18n();
  return (
    <section className={`hero ${styles.root}`} id="home">
      <div className="hero-content">
        <h1 className="hero-title">
          <span className="hero-title-line">{t("home.hero.title1")}</span>
          <span className="hero-title-line hero-title-accent">
            {t("home.hero.title2")}
          </span>
        </h1>
        <p className="hero-subtitle">{t("home.hero.subtitle")}</p>
        <p className="hero-subtitle hero-subtitle--small">
          {t("home.hero.subtitle2")}
        </p>
        <div className="hero-actions">
          <Link href={t("home.hero.ctaHref")} className="btn btn-primary">
            {t("home.hero.cta")}
          </Link>
        </div>
      </div>
      <div className="hero-scroll">
        <div className="scroll-dot"></div>
        <div className="scroll-line-wrap">
          <div className="scroll-line"></div>
        </div>
      </div>
    </section>
  );
}
