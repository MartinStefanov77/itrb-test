import { CareersHero } from "./CareersHero";
import { CareersJobsList } from "./CareersJobsList";
import type { CareersData } from "./types";

export function CareersPage({ data }: { data: CareersData }) {
  return (
    <main id="main-content" className="careers-page-main" data-page="careers">
      <CareersHero title={data.hero.title} intro={data.hero.intro} />
      <section className="section careers-surface">
        <div className="container">
          <CareersJobsList jobs={data.jobs} filters={data.filters} />
        </div>
      </section>
    </main>
  );
}
