"use client";

import { useI18n } from "@/lib/i18n";
import styles from "./WhatWeDoSection.module.scss";

export function WhatWeDoSectionContent() {
  const { t } = useI18n();

  return (
    <div className="split">
      <div className="split-text reveal-left">
        <h2 className="section-heading">{t("home.whatWeDo.heading")}</h2>

        <p className={styles.copy}>{t("home.whatWeDo.p1")}</p>
        <p className={styles.copy}>{t("home.whatWeDo.p2")}</p>
      </div>
      <div className="split-media reveal-right">
        <div className="media-frame">
          <img
            src={"/images/about-photo.svg"}
            alt={"ITRB infrastructure team"}
          />
        </div>
      </div>
    </div>
  );
}
