import { ServicesAccordion } from "./ServicesAccordion";
import type { ServiceItem } from "./types";

export function ServicesSection() {
  return (
    <section className="section svc-section">
      <div className="container">
        <ServicesAccordion />
      </div>
    </section>
  );
}
