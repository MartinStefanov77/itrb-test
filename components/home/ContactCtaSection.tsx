import styles from "./ContactCtaSection.module.scss";

type Props = {
  heading: string;
  text: string;
  ctaLabel: string;
  ctaHref: string;
};

export function ContactCtaSection({ heading, text, ctaLabel, ctaHref }: Props) {
  return (
    <section id="contact-cta" className={`section contact-cta ${styles.root}`}>
      <div className="container">
        <div className={`contact-cta-inner reveal-up ${styles.inner}`}>
          <h2 className="section-heading">{heading}</h2>
          <p>{text}</p>
          <a href={ctaHref} className="btn btn-primary">{ctaLabel}</a>
        </div>
      </div>
    </section>
  );
}
