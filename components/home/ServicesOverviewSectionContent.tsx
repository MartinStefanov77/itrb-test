"use client";

import { useI18n } from "@/lib/i18n";
import styles from "./ServicesOverviewSection.module.scss";
import Link from "next/link";

type ServiceCard = { title: string; description: string };

export function ServicesOverviewSectionContent() {
  const { t } = useI18n();

  return (
    <section
      id="services-overview"
      className={`section bg-dark ${styles.root}`}
    >
      <div className="container">
        <div className="section-header reveal-up">
          <h2 className="section-heading">{t("home.services.heading")}</h2>
        </div>
        <ul className={`home-svc-cards reveal-up ${styles.cards}`}>
          <li>
            <span className="edge-title">{t("home.services.s1")}</span>
            <span className="edge-desc">{t("home.services.s1desc")}</span>
          </li>
          <li>
            <span className="edge-title">{t("home.services.s2")}</span>
            <span className="edge-desc">{t("home.services.s2desc")}</span>
          </li>
          <li>
            <span className="edge-title">{t("home.services.s3")}</span>
            <span className="edge-desc">{t("home.services.s3desc")}</span>
          </li>
          <li>
            <span className="edge-title">{t("home.services.s4")}</span>
            <span className="edge-desc">{t("home.services.s4desc")}</span>
          </li>
          <li>
            <span className="edge-title">{t("home.services.s5")}</span>
            <span className="edge-desc">{t("home.services.s5desc")}</span>
          </li>
          <li>
            <span className="edge-title">{t("home.services.s6")}</span>
            <span className="edge-desc">{t("home.services.s6desc")}</span>
          </li>
          <li>
            <span className="edge-title">{t("home.services.s7")}</span>
            <span className="edge-desc">{t("home.services.s7desc")}</span>
          </li>
          <li>
            <span className="edge-title">{t("home.services.s8")}</span>
            <span className="edge-desc">{t("home.services.s8desc")}</span>
          </li>
        </ul>
        <p className="section-cta reveal-up">
          <Link href={"/services"} className="btn btn-outline">
            {t("home.services.cta")}
          </Link>
        </p>
      </div>
    </section>
  );
}
