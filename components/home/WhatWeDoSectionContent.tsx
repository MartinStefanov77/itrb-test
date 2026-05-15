"use client";

import { useI18n } from "@/lib/i18n";
import styles from "./WhatWeDoSection.module.scss";
import Image from "next/image";
import Link from "next/link";

export function WhatWeDoSectionContent() {
  const { t } = useI18n();

  return (
    <div className="home-two-col home-about-layout">
      <div className="home-two-col-text reveal-left">
        <h2 className="section-heading">{t("home.whatWeDo.heading")}</h2>
        <p className={styles.copy}>{t("home.whatWeDo.p1")}</p>
        <p className={styles.copy}>{t("home.whatWeDo.p2")}</p>
        <div className="section-cta">
          <Link
            href="/who-we-are"
            className="btn btn-outline btn-outline-light"
            aria-label="About ITRB"
          >
            {t("home.approach.cta")}
          </Link>
        </div>
      </div>
      <div
        className="home-two-col-visual home-about-visual reveal-right"
        aria-hidden="true"
      >
        <Image src="/images/woman.jpg" alt="woman" width={866} height={542} />
      </div>
    </div>
  );
}
