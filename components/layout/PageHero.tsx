"use client";
import { useI18n } from "@/lib/i18n";
import { Container } from "./Container";
import { Section } from "./Section";

type PageHeroProps = {
  className?: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
};

export function PageHero({
  className = "",
  title,
  subtitle,
  children,
}: PageHeroProps) {
  const { t } = useI18n();

  return (
    <Section className={className}>
      <Container>
        <h1 className="page-hero-title">{t(title)}</h1>
        {subtitle ? <p className="page-hero-sub">{t(subtitle)}</p> : null}
        {children}
      </Container>
    </Section>
  );
}
