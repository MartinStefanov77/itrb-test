import styles from "./WhatWeDoSection.module.scss";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { WhatWeDoSectionContent } from "./WhatWeDoSectionContent";

export function WhatWeDoSection() {
  return (
    <Section className={`section bg-light deco ${styles.root}`}>
      <Container>
        <WhatWeDoSectionContent />
      </Container>
    </Section>
  );
}
