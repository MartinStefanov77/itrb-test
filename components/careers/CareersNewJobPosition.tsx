"use client";

import Link from "next/link";
import { RenderHTML } from "../site/RenderHTML";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";

const CareersNewJobPosition = ({ slug }: { slug: string }) => {
  const [newJobPositions, setNewJobPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentLang: lang, t } = useI18n();

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/careers-list?locale=${lang}`);

        if (!response.ok) {
          throw new Error("Failed to fetch tests");
        }

        const data = await response.json();
        setNewJobPositions(data.docs || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
        console.error("Error fetching tests:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCareers();
  }, [lang]);

  const job = (newJobPositions as any[]).find((item) => item.slug === slug);

  if (!job) return null;

  return (
    <main
      id="main-content"
      className="careers-job-main"
      data-page="careers-job"
    >
      <article className="careers-job">
        <header className="careers-job-header">
          <div className="container careers-job-header-inner">
            <Link href="/careers" className="careers-back">
              ← All open positions
            </Link>
            <h1 className="careers-job-title">{job.title}</h1>
            <p className="careers-job-meta">
              {job.location} · {job.workType}
            </p>

            <div className="careers-job-body">
              <section className="careers-job-section">
                <h2 className="careers-job-section-title">Your role</h2>

                <RenderHTML data={job["yourRole"]!} className="careers-prose" />
              </section>
              <section className="careers-job-section">
                <h2 className="careers-job-section-title">Requirements</h2>

                <RenderHTML
                  data={job["requirements"]!}
                  className="careers-prose"
                />
              </section>
              <section className="careers-job-section">
                <h2 className="careers-job-section-title">What we offer</h2>

                <RenderHTML data={job.whatWeOffer!} className="careers-prose" />
              </section>
              <p className="careers-job-note">
                We treat all applications confidentially. Only shortlisted
                candidates will be contacted for an interview.
              </p>
            </div>
          </div>
        </header>
        <div className="container careers-job-cta-wrap">
          <aside
            className="careers-job-cta"
            aria-labelledby="careers-j1-cta-title"
          >
            <h2 id="careers-j1-cta-title" className="careers-job-cta-title">
              Apply for this position
            </h2>
            <p className="careers-job-cta-sub">
              We will contact you if your profile is a good fit for the role.
            </p>
            <a
              href={job.applyUrl!}
              className="btn btn-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Apply
            </a>
          </aside>
        </div>
      </article>
    </main>
  );
};

export default CareersNewJobPosition;
