import styles from "./WhoWeArePage.module.scss";
import { TeamSlider } from "./TeamSlider";
import { WhoWeAreInteractions } from "./WhoWeAreInteractions";
import { WhoWeAreCertLightbox } from "./WhoWeAreCertLightbox";
import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";

type Step = { title: string; description: string };
type TitledDesc = { title: string; description: string };
type TeamMember = { name: string; role: string; bio: string; image: string };

type WhoWeAreData = {
  hero: { title: string; intro1: string; intro2: string };
  approach: { heading: string; description: string; image: string; imageAlt: string };
  lifecycle: { heading: string; intro: string; steps: Step[] };
  principles: { heading: string; items: TitledDesc[] };
  industries: { heading: string; intro: string; items: string[] };
  certificates: { heading: string; intro: string; items: string[] };
  team: { heading: string; intro: string; members: TeamMember[] };
};

export function WhoWeArePage({ data }: { data: WhoWeAreData }) {
  return (
    <main id="main-content" data-page="who-we-are" className={styles.root}>
      <WhoWeAreInteractions />
      <PageHero className="page-hero page-hero--bg page-hero--wide" title={data.hero.title} subtitle={data.hero.intro1}>
        <p className="page-hero-sub page-hero-sub--mt">{data.hero.intro2}</p>
      </PageHero>

      <Section id="approach" className="section bg-light deco">
        <Container>
          <div className="split">
            <div className="split-text reveal-left">
              <h2 className="section-heading">{data.approach.heading}</h2>
              <p>{data.approach.description}</p>
            </div>
            <div className="split-media reveal-right">
              <div className="media-frame">
                <img src={data.approach.image} alt={data.approach.imageAlt} />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section id="lifecycle" className="section bg-gradient">
        <Container>
          <SectionHeader title={data.lifecycle.heading} subtitle={data.lifecycle.intro} className="section-header reveal-up" />
          <div className="wwa-lifecycle reveal-up">
            {data.lifecycle.steps.map((step, i) => (
              <div className="wwa-step" key={step.title}>
                <div className="wwa-step-dot">{i + 1}</div>
                <div className="wwa-step-body">
                  <h3 className="wwa-step-title">{step.title}</h3>
                  <p className="wwa-step-desc">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section id="principles" className="section bg-light">
        <Container>
          <SectionHeader title={data.principles.heading} className="section-header reveal-up" />
          <ul className="home-edge-list reveal-up">
            {data.principles.items.map((item) => (
              <li key={item.title}>
                <span className="edge-title">{item.title}</span>
                <span className="edge-desc">{item.description}</span>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section id="industries" className="section bg-dark">
        <Container>
          <SectionHeader title={data.industries.heading} subtitle={data.industries.intro} className="section-header reveal-up" />
          <ul className="wwa-industries reveal-up">
            {data.industries.items.map((industry) => (
              <li key={industry}>{industry}</li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section id="certificates" className="section bg-mid deco-top">
        <Container>
          <SectionHeader title={data.certificates.heading} subtitle={data.certificates.intro} className="section-header reveal-up" />
          <ul className="cert-list reveal-up">
            {data.certificates.items.map((cert, i) => (
              <li key={cert}>
                <button type="button" className="cert-trigger" data-cert-index={i}>
                  {cert}
                </button>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <WhoWeAreCertLightbox certificates={data.certificates.items} />

      <Section id="organization" className="section org">
        <Container>
          <SectionHeader title={data.team.heading} subtitle={data.team.intro} className="section-header reveal-up" />
          <TeamSlider members={data.team.members} />
        </Container>
      </Section>
    </main>
  );
}
