"use client";

import { useI18n } from "@/lib/i18n";
import Link from "next/link";

const NotFoundComponent = () => {
  const { t } = useI18n();

  return (
    <main id="main-content" className="not-found-main">
      <div className="container">
        <div className="not-found-inner">
          <p className="not-found-code">404</p>
          <h1>{t("notfound.heading")}</h1>
          <p className="not-found-desc">{t("notfound.desc")}</p>
          <div className="not-found-actions">
            <Link href="/" className="btn btn-primary">
              {t("notfound.cta.home")}
            </Link>
            <Link href="/contact" className="btn btn-outline">
              {t("notfound.cta.contact")}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NotFoundComponent;
