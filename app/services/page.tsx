import servicesData from "@/data/services.json";
import { ServicesHero } from "@/components/services/ServicesHero";
import { ServicesSection } from "@/components/services/ServicesSection";
import type { ServicesData } from "@/components/services/types";

export default function ServicesPage() {
  const data = servicesData as ServicesData;

  return (
    <main id="main-content" data-page="services">
      <ServicesHero title={data.hero.title} intro={data.hero.intro} />
      <ServicesSection items={data.items} />
    </main>
  );
}
