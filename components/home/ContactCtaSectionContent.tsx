"use client";

import { useI18n } from "@/lib/i18n";
import Link from "next/link";
import styles from "./ContactCtaSection.module.scss";

export function ContactCtaSectionContent() {
  const { t } = useI18n();
  return (
    <section id="contact-cta" className={`section contact-cta ${styles.root}`}>
      <div className="container">
        <div className={`contact-cta-inner reveal-up ${styles.inner}`}>
          <h2 className="section-heading">{t("home.contactCta.heading")}</h2>
          <p>{t("home.contactCta.desc")}</p>
          <Link href={"/contact"} className="btn btn-primary">
            {t("home.contactCta.cta")}
          </Link>
        </div>
      </div>
    </section>
  );
}
