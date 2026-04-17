"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navItems } from "@/lib/site-data";
import styles from "./Header.module.scss";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

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

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/careers") return pathname === "/careers" || pathname.startsWith("/careers-job/");
    return pathname === href;
  };

  return (
    <header className={`${styles.header} ${open ? styles.menuOpen : ""}`}>
      <nav id="navbar" className="scrolled" aria-label="Main navigation">
        <div className="nav-inner">
          <Link href="/" className="nav-logo" onClick={() => setOpen(false)}>
            <img src="/images/logo-white.svg" alt="ITRB" className="logo-img" width={171} height={38} />
          </Link>

          <ul className={`nav-links ${open ? "open" : ""}`} id="navLinks" aria-hidden={open ? "false" : "true"}>
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={isActive(item.href) ? "active" : ""}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="nav-actions">
            <button className={`hamburger ${open ? "open" : ""}`} onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </nav>
      <div className={`nav-backdrop ${open ? "visible" : ""}`} onClick={() => setOpen(false)} aria-hidden="true"></div>
    </header>
  );
}
