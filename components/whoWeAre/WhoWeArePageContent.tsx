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
import Image from "next/image";

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
        className="page-hero page-hero-bg page-hero-wide"
        title={t("wwa.heading")}
        subtitle={t("wwa.intro1")}
      >
        <p className="page-hero-sub page-hero-sub-mt">{t("wwa.intro2")}</p>
      </PageHero>

      <Section id="approach" className="section our-approach">
        <Container>
          <div className="home-two-col home-wwa-two-col">
            <div className="home-two-col-text reveal-left">
              <h2 className="section-heading">{t("wwa.approach.heading")}</h2>
              <p>{t("wwa.approach.desc")}</p>
            </div>
            <div className="split-media reveal-right">
              <div className="media-frame">
                <Image
                  src="/images/approach-page.jpg"
                  alt="Approach &amp; Positioning"
                  width={864}
                  height={540}
                />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section id="lifecycle" className="section lifecycle">
        <Container>
          <div className="home-two-col home-wwa-two-col">
            <div className="home-two-col-text reveal-up">
              <SectionHeader
                title={t("wwa.lifecycle.heading")}
                subtitle={t("wwa.lifecycle.intro")}
              />
            </div>
            <div className="wwa-lifecycle-col reveal-up">
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
            </div>
          </div>
        </Container>
      </Section>

      <Section id="principles" className="section principles">
        <Container>
          <div className="home-two-col home-wwa-two-col">
            <SectionHeader
              title={t("wwa.principles.heading")}
              className="home-two-col-text reveal-left"
            />
          </div>
          <div className="wwa-principles-cards reveal-up" role="list">
            {PRINCIPLE_KEYS.map((key) => (
              <article className="wwa-principle-card reveal-up" key={key}>
                <h3 className="wwa-principle-title">
                  {t(`wwa.principles.${key}.title`)}
                </h3>
                <p className="wwa-principle-text">
                  {t(`wwa.principles.${key}.desc`)}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section id="industries" className="section industries">
        <Container>
          <div className="home-two-col home-wwa-two-col">
            <div className="home-two-col-text reveal-left">
              <SectionHeader
                title={t("wwa.industries.heading")}
                subtitle={t("wwa.industries.intro")}
              />
              <ul className="wwa-industries">
                {INDUSTRY_KEYS.map((key) => (
                  <li key={key}>{t(`wwa.industries.${key}`)}</li>
                ))}
              </ul>
            </div>

            <div className="wwa-industries-wrap reveal-right">
              <div className="media-frame">
                <Image
                  src="/images/industries.jpg"
                  alt="Industries We Support"
                  width={864}
                  height={540}
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section id="certificates" className="section certificates">
        <Container>
          <div className="home-two-col home-wwa-two-col">
            <SectionHeader
              title={t("wwa.cert.heading")}
              subtitle={t("wwa.cert.intro1")}
              className="home-two-col-text reveal-left"
            />
            <WhoWeAreCertLightbox certificates={certTitles} lang={currentLang}>
              {(openAt) => (
                <ul className="cert-list reveal-right">
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
          </div>
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
