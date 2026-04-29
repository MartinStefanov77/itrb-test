import { notFound } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";
import CareersNewJobPosition from "@/components/careers/CareersNewJobPosition";

export async function generateStaticParams() {
  const payload = await getPayload({ config });

  const newJobPositions = await payload.find({
    collection: "new-job-positions",
    locale: "en",
  });

  return newJobPositions.docs.map((job) => ({ slug: job.slug }));
}

export default async function CareersJobPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <CareersNewJobPosition slug={slug} />;
}
