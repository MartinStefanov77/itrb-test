import { ServicesAccordion } from "./ServicesAccordion";
import type { ServiceItem } from "./types";

export function ServicesSection() {
  return (
    <section className="section svc-section">
      <div className="container">
        <div className="svc-layout">
          <aside className="svc-side-gallery" aria-hidden="true">
            <div className="svc-side-gallery-item">
              <img src="images/services-bg.jpg" alt="" loading="lazy" />
            </div>
          </aside>
          <ServicesAccordion />
        </div>
      </div>
    </section>
  );
}
