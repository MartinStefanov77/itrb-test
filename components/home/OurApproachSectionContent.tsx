"use client";

import { useI18n } from "@/lib/i18n";
import styles from "./OurApproachSection.module.scss";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import Link from "next/link";

export function OurApproachSectionContent() {
  const { t } = useI18n();

  return (
    <Section
      id="our-approach"
      className={`section bg-dark deco deco--rotated ${styles.root}`}
    >
      <Container>
        <div className="split">
          <div className="split-media reveal-left">
            <div className="media-frame">
              <img src={"/images/service-3.svg"} alt={"Our approach"} />
            </div>
          </div>
          <div className="split-text reveal-right">
            <h2 className="section-heading">{t("home.approach.heading")}</h2>

            <p className={styles.paragraph}>{t("home.approach.intro")}</p>
            <p className={styles.paragraph}>{t("home.approach.para")}</p>
            <Link href={"/who-we-are"} className="btn btn-outline">
              {t("home.approach.cta")}
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
