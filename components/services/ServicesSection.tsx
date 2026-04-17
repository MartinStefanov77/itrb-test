import { ServicesAccordion } from "./ServicesAccordion";
import type { ServiceItem } from "./types";

export function ServicesSection({ items }: { items: ServiceItem[] }) {
  return (
    <section className="section svc-section">
      <div className="container">
        <ServicesAccordion items={items} />
      </div>
    </section>
  );
}
