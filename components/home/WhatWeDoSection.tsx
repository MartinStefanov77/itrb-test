import styles from "./WhatWeDoSection.module.scss";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";

type Props = {
  heading: string;
  paragraphs: string[];
  image: string;
  imageAlt: string;
 
};

export function WhatWeDoSection({ heading, paragraphs, image, imageAlt }: Props) {
  return (
    <Section className={`section bg-light deco ${styles.root}`}>
      <Container>
        <div className="split">
          <div className="split-text reveal-left">
            <h2 className="section-heading">{heading}</h2>
           {paragraphs.map((paragraph: string) => (
            <p key={paragraph} className={styles.copy}>{paragraph}</p>
           ))}
          </div>
          <div className="split-media reveal-right">
            <div className="media-frame">
              <img src={image} alt={imageAlt} />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
