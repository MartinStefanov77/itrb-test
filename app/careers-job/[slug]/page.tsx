import Link from "next/link";
import { notFound } from "next/navigation";
import { jobs } from "@/lib/site-data";

export function generateStaticParams() {
  return jobs.map((job) => ({ slug: job.slug }));
}

export default async function CareersJobPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = jobs.find((item) => item.slug === slug);
  if (!job) notFound();

  return (
    <main id="main-content" className="careers-job-main" data-page="careers-job">
      <article className="careers-job">
        <header className="careers-job-header">
          <div className="container careers-job-header-inner">
            <Link href="/careers" className="careers-back">← All open positions</Link>
            <h1 className="careers-job-title">{job.title}</h1>
            <p className="careers-job-meta">{job.location} · {job.workType}</p>

            <div className="careers-job-body">
              <section className="careers-job-section">
                <h2 className="careers-job-section-title">Your role</h2>
                <ul className="careers-prose">{job.responsibilities.map((v) => <li key={v}>{v}</li>)}</ul>
              </section>
              <section className="careers-job-section">
                <h2 className="careers-job-section-title">Requirements</h2>
                <ul className="careers-prose">{job.requirements.map((v) => <li key={v}>{v}</li>)}</ul>
              </section>
              <section className="careers-job-section">
                <h2 className="careers-job-section-title">What we offer</h2>
                <ul className="careers-prose">{job.offer.map((v) => <li key={v}>{v}</li>)}</ul>
              </section>
            </div>
          </div>
        </header>
      </article>
    </main>
  );
}
