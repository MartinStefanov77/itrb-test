import type { ReactNode } from "react";
import { Container } from "./Container";
import { Section } from "./Section";

type PageHeroProps = {
  className?: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
};

export function PageHero({ className = "", title, subtitle, children }: PageHeroProps) {
  return (
    <Section className={className}>
      <Container>
        <h1 className="page-hero-title">{title}</h1>
        {subtitle ? <p className="page-hero-sub">{subtitle}</p> : null}
        {children}
      </Container>
    </Section>
  );
}
