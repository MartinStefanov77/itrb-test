"use client";

import { useI18n } from "@/lib/i18n";
import styles from "./OurEdgeSection.module.scss";

export function OurEdgeSectionContent() {
  const { t } = useI18n();
  return (
    <section id="our-edge" className={`section bg-light ${styles.root}`}>
      <div className="container">
        <div className="section-header reveal-up">
          <h2 className="section-heading">{t("home.edge.heading")}</h2>
        </div>
        <ul className={`home-edge-list reveal-up ${styles.list}`}>
          <li>
            <span className="edge-title">{t("home.edge.e1.title")}</span>
            <span className="edge-desc">{t("home.edge.e1.desc")}</span>
          </li>
          <li>
            <span className="edge-title">{t("home.edge.e2.title")}</span>
            <span className="edge-desc">{t("home.edge.e2.desc")}</span>
          </li>
          <li>
            <span className="edge-title">{t("home.edge.e3.title")}</span>
            <span className="edge-desc">{t("home.edge.e3.desc")}</span>
          </li>
          <li>
            <span className="edge-title">{t("home.edge.e4.title")}</span>
            <span className="edge-desc">{t("home.edge.e4.desc")}</span>
          </li>
          <li>
            <span className="edge-title">{t("home.edge.e5.title")}</span>
            <span className="edge-desc">{t("home.edge.e5.desc")}</span>
          </li>
          <li>
            <span className="edge-title">{t("home.edge.e6.title")}</span>
            <span className="edge-desc">{t("home.edge.e6.desc")}</span>
          </li>
        </ul>
      </div>
    </section>
  );
}
