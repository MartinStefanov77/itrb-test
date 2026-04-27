"use client";

import styles from "./WhoWeArePage.module.scss";
import { RevealInteractions } from "@/components/site/RevealInteractions";
import { WhoWeAreCertLightbox } from "./WhoWeAreCertLightbox";
import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { useI18n } from "@/lib/i18n";
import { TeamSlider } from "./TeamSlider";

import whoWeAreData from "@/data/who-we-are.json";

const LIFECYCLE_KEYS = ["s1", "s2", "s3", "s4", "s5", "s6"] as const;
const PRINCIPLE_KEYS = ["p1", "p2", "p3", "p4", "p5"] as const;
const INDUSTRY_KEYS = ["i1", "i2", "i3", "i4", "i5"] as const;
const CERT_KEYS = ["c1", "c2", "c3", "c4"] as const;

export function WhoWeArePageContent() {
  const { t, currentLang } = useI18n();

  const certTitles = CERT_KEYS.map((k) => t(`wwa.cert.${k}.title`));

  return (
    <main id="main-content" data-page="who-we-are" className={styles.root}>
      <RevealInteractions />

      <PageHero
        className="page-hero page-hero--bg page-hero--wide"
        title={t("wwa.heading")}
        subtitle={t("wwa.intro1")}
      >
        <p className="page-hero-sub page-hero-sub--mt">{t("wwa.intro2")}</p>
      </PageHero>

      <Section id="approach" className="section bg-light deco">
        <Container>
          <div className="split">
            <div className="split-text reveal-left">
              <h2 className="section-heading">{t("wwa.approach.heading")}</h2>
              <p>{t("wwa.approach.desc")}</p>
            </div>
            <div className="split-media reveal-right">
              <div className="media-frame">
                <img
                  src="/images/about-photo.svg"
                  alt="ITRB infrastructure team"
                />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section id="lifecycle" className="section bg-gradient">
        <Container>
          <SectionHeader
            title={t("wwa.lifecycle.heading")}
            subtitle={t("wwa.lifecycle.intro")}
            className="section-header reveal-up"
          />
          <div className="wwa-lifecycle reveal-up">
            {LIFECYCLE_KEYS.map((key, i) => (
              <div className="wwa-step" key={key}>
                <div className="wwa-step-dot">{i + 1}</div>
                <div className="wwa-step-body">
                  <h3 className="wwa-step-title">
                    {t(`wwa.lifecycle.${key}.title`)}
                  </h3>
                  <p className="wwa-step-desc">
                    {t(`wwa.lifecycle.${key}.desc`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section id="principles" className="section bg-light">
        <Container>
          <SectionHeader
            title={t("wwa.principles.heading")}
            className="section-header reveal-up"
          />
          <ul className="home-edge-list reveal-up">
            {PRINCIPLE_KEYS.map((key) => (
              <li key={key}>
                <span className="edge-title">
                  {t(`wwa.principles.${key}.title`)}
                </span>
                <span className="edge-desc">
                  {t(`wwa.principles.${key}.desc`)}
                </span>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section id="industries" className="section bg-dark">
        <Container>
          <SectionHeader
            title={t("wwa.industries.heading")}
            subtitle={t("wwa.industries.intro")}
            className="section-header reveal-up"
          />
          <ul className="wwa-industries reveal-up">
            {INDUSTRY_KEYS.map((key) => (
              <li key={key}>{t(`wwa.industries.${key}`)}</li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section id="certificates" className="section bg-mid deco-top">
        <Container>
          <SectionHeader
            title={t("wwa.cert.heading")}
            subtitle={t("wwa.cert.intro1")}
            className="section-header reveal-up"
          />
          <WhoWeAreCertLightbox certificates={certTitles} lang={currentLang}>
            {(openAt) => (
              <ul className="cert-list reveal-up">
                {certTitles.map((cert, i) => (
                  <li key={cert}>
                    <button
                      type="button"
                      className="cert-trigger"
                      onClick={(e) => openAt(i, e.currentTarget)}
                    >
                      {cert}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </WhoWeAreCertLightbox>
        </Container>
      </Section>

      <Section id="organization" className="section org">
        <Container>
          <SectionHeader
            title={t("org.heading")}
            subtitle={t("org.sub")}
            className="section-header reveal-up"
          />
          <TeamSlider />
        </Container>
      </Section>
    </main>
  );
}
