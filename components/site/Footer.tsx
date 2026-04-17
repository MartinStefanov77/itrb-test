import Link from "next/link";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <Link href="/" className="footer-logo">
          <img src="/images/logo-white.svg" alt="ITRB" width={135} height={30} />
        </Link>
        <ul className="footer-nav">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/services">Services</Link></li>
          <li><Link href="/who-we-are">Who we are</Link></li>
          <li><Link href="/careers">Careers</Link></li>
          <li><Link href="/contact">Contact</Link></li>
          <li><Link href="/privacy-policy">Privacy Policy</Link></li>
        </ul>
        <p className="footer-copy">© 2026 ITRB. All rights reserved.</p>
      </div>
    </footer>
  );
}
