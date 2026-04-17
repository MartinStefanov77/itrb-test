import styles from "./ServicesOverviewSection.module.scss";

type ServiceCard = { title: string; description: string };

type Props = {
  heading: string;
  ctaLabel: string;
  ctaHref: string;
  items: ServiceCard[];
};

export function ServicesOverviewSection({ heading, ctaLabel, ctaHref, items }: Props) {
  return (
    <section id="services-overview" className={`section bg-dark ${styles.root}`}>
      <div className="container">
        <div className="section-header reveal-up">
          <h2 className="section-heading">{heading}</h2>
        </div>
        <ul className={`home-svc-cards reveal-up ${styles.cards}`}>
          {items.map((item) => (
            <li key={item.title}>
              <span className="edge-title">{item.title}</span>
              <span className="edge-desc">{item.description}</span>
            </li>
          ))}
        </ul>
        <p className="section-cta reveal-up">
          <a href={ctaHref} className="btn btn-outline">{ctaLabel}</a>
        </p>
      </div>
    </section>
  );
}
