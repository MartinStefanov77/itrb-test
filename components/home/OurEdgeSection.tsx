import styles from "./OurEdgeSection.module.scss";

type EdgeItem = { title: string; description: string };

type Props = {
  heading: string;
  items: EdgeItem[];
};

export function OurEdgeSection({ heading, items }: Props) {
  return (
    <section id="our-edge" className={`section bg-light ${styles.root}`}>
      <div className="container">
        <div className="section-header reveal-up">
          <h2 className="section-heading">{heading}</h2>
        </div>
        <ul className={`home-edge-list reveal-up ${styles.list}`}>
          {items.map((item) => (
            <li key={item.title}>
              <span className="edge-title">{item.title}</span>
              <span className="edge-desc">{item.description}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
