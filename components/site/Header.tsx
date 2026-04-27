"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navItems } from "@/lib/site-data";
import { useI18n } from "@/lib/i18n";
import styles from "./Header.module.scss";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { currentLang, setLanguage, t } = useI18n();

  const NavbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    /* ---- Sticky Nav & Active Section ------------------------------------ */
    function onScroll() {
      NavbarRef.current?.classList.toggle("scrolled", window.scrollY > 40);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/careers")
      return pathname === "/careers" || pathname.startsWith("/careers-job/");
    return pathname === href;
  };

  return (
    <header className={`${styles.header} ${open ? styles.menuOpen : ""}`}>
      <nav
        id="navbar"
        className="scrolled"
        aria-label="Main navigation"
        ref={NavbarRef}
      >
        <div className="nav-inner">
          <Link href="/" className="nav-logo" onClick={() => setOpen(false)}>
            <img
              src="/images/logo-white.svg"
              alt="ITRB"
              className="logo-img"
              width={171}
              height={38}
            />
          </Link>

          <ul
            className={`nav-links ${open ? "open" : ""}`}
            id="navLinks"
            aria-hidden={open ? "false" : "true"}
          >
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={isActive(item.href) ? "active" : ""}
                  onClick={() => setOpen(false)}
                >
                  {t(item.labelKey)}
                </Link>
              </li>
            ))}
          </ul>

          <div className="nav-actions">
            <div className="lang-switcher">
              <button
                className={`lang-btn ${currentLang === "en" ? "active" : ""}`}
                data-lang="en"
                onClick={() => setLanguage("en")}
                aria-label="Switch to English"
              >
                EN
              </button>
              <span className="lang-sep">/</span>
              <button
                className={`lang-btn ${currentLang === "bg" ? "active" : ""}`}
                data-lang="bg"
                onClick={() => setLanguage("bg")}
                aria-label="Превключи на Български"
              >
                BG
              </button>
            </div>
            <button
              className={`hamburger ${open ? "open" : ""}`}
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </nav>
      <div
        className={`nav-backdrop ${open ? "visible" : ""}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      ></div>
    </header>
  );
}
