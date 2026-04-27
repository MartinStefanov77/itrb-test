import { ServicesHero } from "@/components/services/ServicesHero";
import { ServicesSection } from "@/components/services/ServicesSection";

export default function ServicesPage() {
  return (
    <main id="main-content" data-page="services">
      <ServicesHero />
      <ServicesSection />
    </main>
  );
}
