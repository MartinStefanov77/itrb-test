import Link from "next/link";
import { notFound } from "next/navigation";
import { jobs } from "@/lib/site-data";
import { getPayload } from "payload";
import config from '@payload-config'
import { RenderHTML } from "@/components/site/RenderHTML";


export async function generateStaticParams() {

  const payload = await getPayload({ config })

  const newJobPositions = await payload.find({
    collection: 'new-job-positions',
    locale: 'en'
  })  

  return newJobPositions.docs.map((job) => ({ slug: job.slug }));
}

export default async function CareersJobPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const payload = await getPayload({ config })

  const newJobPositions = await payload.find({
    collection: 'new-job-positions',
    locale: 'en'
  })  

  const job = newJobPositions.docs.find((item) => item.slug === slug);

  if (!job) notFound();

  console.log(job);

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
               
                <RenderHTML data={job['yourRole']!} className="careers-prose" />
              </section>
              <section className="careers-job-section">
                <h2 className="careers-job-section-title">Requirements</h2>
                
                <RenderHTML data={job['requirements']!} className="careers-prose" />
              </section>
              <section className="careers-job-section">
                <h2 className="careers-job-section-title">What we offer</h2>
             
                <RenderHTML data={job.whatWeOffer!} className="careers-prose" />
              </section>
              <p className="careers-job-note">We treat all applications confidentially. Only shortlisted candidates will be contacted for an interview.</p>
            </div>
          </div>
        </header>
        <div className="container careers-job-cta-wrap">
          <aside className="careers-job-cta" aria-labelledby="careers-j1-cta-title">
            <h2 id="careers-j1-cta-title" className="careers-job-cta-title" >Apply for this position</h2>
            <p className="careers-job-cta-sub" >We will contact you if your profile is a good fit for the role.</p>
            <a href={job.applyUrl!} className="btn btn-primary" target="_blank" rel="noopener noreferrer" >Apply</a>
          </aside>
        </div>
      </article>
    </main>
  );
}
