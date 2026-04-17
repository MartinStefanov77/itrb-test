import { PageHero } from "@/components/layout/PageHero";

export function CareersHero({ title, intro }: { title: string; intro: string }) {
  return <PageHero className="page-hero page-hero--careers" title={title} subtitle={intro} />;
}
