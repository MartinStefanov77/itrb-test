import type { Metadata } from "next";
import "./globals.scss";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { I18nProvider } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "ITRB",
  description: "Complex infrastructure. Engineered right.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <I18nProvider>
          <a className="skip-link" href="#main-content">Skip to main content</a>
          <Header />
          {children}
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}