"use client";

import { useI18n } from "@/lib/i18n";
import styles from "./OurApproachSection.module.scss";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import Link from "next/link";
import Image from "next/image";

export function OurApproachSectionContent() {
  const { t } = useI18n();

  return (
    <Section
      id="our-approach"
      className={`section approach-overview deco deco-rotated ${styles.root}`}
    >
      <Container>
        <div className="container approach-overview-container">
          <div className="home-two-col home-approach-layout">
            <div className="home-two-col-text home-approach-intro reveal-left">
              <h2 className="section-heading">{t("home.approach.heading")}</h2>
              <div className="home-approach-body split-text">
                <p>{t("home.approach.intro")}</p>
                <p>{t("home.approach.para")}</p>
                <p>{t("home.approach.envs")}</p>
                <p className="cert-home-teaser">
                  {t("home.cert.teaser")}
                  <Link
                    href="/who-we-are.html#certificates"
                    className="cert-inline-link"
                  >
                    {t("home.cert.link")}
                  </Link>
                  .
                </p>
              </div>
              <div className="section-cta">
                <Link
                  href="/who-we-are"
                  className="btn btn-outline btn-outline-light"
                  aria-label="About ITRB — our approach and positioning"
                >
                  {t("home.approach.cta")}
                </Link>
              </div>
            </div>
            <div
              className="home-two-col-visual home-approach-visual reveal-right is-visible"
              aria-hidden="true"
            >
              <Image
                src="/images/approach-bg.jpg"
                alt="Approach"
                width={867}
                height={540}
                loading="eager"
              />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
