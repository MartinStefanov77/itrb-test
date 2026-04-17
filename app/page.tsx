import homeData from "@/data/home.json";
import { ContactCtaSection } from "@/components/home/ContactCtaSection";
import { HeroSection } from "@/components/home/HeroSection";
import { HomeRevealInit } from "@/components/home/HomeRevealInit";
import { OurApproachSection } from "@/components/home/OurApproachSection";
import { OurEdgeSection } from "@/components/home/OurEdgeSection";
import { ServicesOverviewSection } from "@/components/home/ServicesOverviewSection";
import { WhatWeDoSection } from "@/components/home/WhatWeDoSection";

export default function Home() {
  return (
    <main id="main-content" data-page="home">
      <HomeRevealInit />
      <HeroSection {...homeData.hero} />
      <WhatWeDoSection {...homeData.whatWeDo} />
      <ServicesOverviewSection {...homeData.servicesOverview} />
      <OurEdgeSection {...homeData.ourEdge} />
      <OurApproachSection {...homeData.ourApproach} />
      <ContactCtaSection {...homeData.contactCta} />
    </main>
  );
}
