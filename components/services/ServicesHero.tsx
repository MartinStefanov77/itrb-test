import { PageHero } from "@/components/layout/PageHero";

type Props = {
  title: string;
  intro: string;
};

export function ServicesHero({ title, intro }: Props) {
  return <PageHero className="page-hero page-hero--bg" title={title} subtitle={intro} />;
}
