import styles from "./OurApproachSection.module.scss";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";

type Props = {
  heading: string;
  paragraphs: string[];
  image: string;
  imageAlt: string;
  ctaLabel: string;
  ctaHref: string;
};

export function OurApproachSection({ heading, paragraphs, image, imageAlt, ctaLabel, ctaHref }: Props) {
  return (
    <Section id="our-approach" className={`section bg-dark deco deco--rotated ${styles.root}`}>
      <Container>
        <div className="split">
          <div className="split-media reveal-left">
            <div className="media-frame">
              <img src={image} alt={imageAlt} />
            </div>
          </div>
          <div className="split-text reveal-right">
            <h2 className="section-heading">{heading}</h2>
            {paragraphs.map((paragraph) => (
              <p key={paragraph} className={styles.paragraph}>{paragraph}</p>
            ))}
            <a href={ctaHref} className="btn btn-outline">{ctaLabel}</a>
          </div>
        </div>
      </Container>
    </Section>
  );
}
