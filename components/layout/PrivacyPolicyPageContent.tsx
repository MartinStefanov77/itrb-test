"use client";

import { useI18n } from "@/lib/i18n";

export function PrivacyPolicyPageContent() {
  const { t } = useI18n();

  return (
    <main id="main-content" className="privacy-main" data-page="privacy">
      <div className="container">
        <div className="privacy-hero">
          <h1>{t("privacy.title")}</h1>
          <p className="privacy-intro">{t("privacy.intro")}</p>
        </div>
        <div className="privacy-sections">
          <article className="privacy-section">
            <h2>{t("privacy.s1.heading")}</h2>
            <p dangerouslySetInnerHTML={{ __html: t("privacy.s1.text") }} />
          </article>
          <article className="privacy-section">
            <h2>{t("privacy.s2.heading")}</h2>
            <p>{t("privacy.s2.text")}</p>
          </article>
          <article className="privacy-section">
            <h2>{t("privacy.s3.heading")}</h2>
            <p>{t("privacy.s3.text")}</p>
          </article>
          <article className="privacy-section">
            <h2>{t("privacy.s4.heading")}</h2>
            <p>{t("privacy.s4.text")}</p>
          </article>
          <article className="privacy-section">
            <h2>{t("privacy.s5.heading")}</h2>
            <p>{t("privacy.s5.text")}</p>
          </article>
          <article className="privacy-section">
            <h2>{t("privacy.s6.heading")}</h2>
            <p>{t("privacy.s6.text")}</p>
          </article>
          <article className="privacy-section">
            <h2>{t("privacy.s7.heading")}</h2>
            <p dangerouslySetInnerHTML={{ __html: t("privacy.s7.text") }} />
          </article>
          <article className="privacy-section">
            <h2>{t("privacy.s8.heading")}</h2>
            <p dangerouslySetInnerHTML={{ __html: t("privacy.s8.text") }} />
          </article>
        </div>
      </div>
    </main>
  );
}
