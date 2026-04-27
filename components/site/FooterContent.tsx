"use client";
import { useI18n } from "@/lib/i18n";
import Link from "next/link";

export function FooterContent() {
  const { t } = useI18n();

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <Link href="/" className="footer-logo">
          <img
            src="/images/logo-white.svg"
            alt="ITRB"
            width={135}
            height={30}
          />
        </Link>
        <ul className="footer-nav">
          <li>
            <Link href="/"> {t("nav.home")} </Link>
          </li>
          <li>
            <Link href="/services"> {t("nav.services")} </Link>
          </li>
          <li>
            <Link href="/who-we-are"> {t("nav.whoWeAre")} </Link>
          </li>
          <li>
            <Link href="/careers"> {t("nav.careers")} </Link>
          </li>
          <li>
            <Link href="/contact"> {t("nav.contact")} </Link>
          </li>
          <li>
            <Link href="/privacy-policy"> {t("footer.privacy")} </Link>
          </li>
        </ul>
        <p className="footer-copy"> {t("footer.copy")} </p>
      </div>
    </footer>
  );
}
