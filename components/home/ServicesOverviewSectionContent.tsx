"use client";

import { useI18n } from "@/lib/i18n";
import Link from "next/link";

export function ServicesOverviewSectionContent() {
  const { t } = useI18n();

  return (
    <section id="services-overview" className="section services-overview">
      <div className="container">
        <div className="home-two-col home-services-layout">
          <div className="home-two-col-text home-services-intro reveal-left">
            <h2 className="section-heading">{t("home.services.heading")}</h2>
            <p className="home-services-intro-text">{t("srv.intro")}</p>
            <div className="section-cta">
              <Link
                href="/services"
                className="btn btn-outline btn-outline-light"
              >
                {t("home.services.viewAll")}
              </Link>
            </div>
          </div>
          <div className="services-overview-links">
            <Link
              href="/services#acc-trigger-1"
              className="service-link-card reveal-up"
            >
              <h3 className="service-link-title">{t("srv.s1.title")}</h3>
              <span className="service-link-more">
                {t("home.services.linkLabel")}
              </span>
            </Link>
            <Link
              href="/services#acc-trigger-2"
              className="service-link-card reveal-up"
            >
              <h3 className="service-link-title">{t("srv.s2.title")}</h3>
              <span className="service-link-more">
                {t("home.services.linkLabel")}
              </span>
            </Link>
            <Link
              href="/services#acc-trigger-3"
              className="service-link-card reveal-up"
            >
              <h3 className="service-link-title">{t("srv.s3.title")}</h3>
              <span className="service-link-more">
                {t("home.services.linkLabel")}
              </span>
            </Link>
            <Link
              href="/services#acc-trigger-4"
              className="service-link-card reveal-up"
            >
              <h3 className="service-link-title">{t("srv.s4.title")}</h3>
              <span className="service-link-more">
                {t("home.services.linkLabel")}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
