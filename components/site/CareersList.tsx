"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Job } from "@/lib/site-data";

export function CareersList({ jobs }: { jobs: Job[] }) {
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("");

  const departments = useMemo(() => [...new Set(jobs.map((j) => j.department))], [jobs]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return jobs.filter((job) => {
      const deptOk = !department || job.department === department;
      const qOk = !q || `${job.title} ${job.summary}`.toLowerCase().includes(q);
      return deptOk && qOk;
    });
  }, [jobs, query, department]);

  return (
    <>
      <form className="careers-filters">
        <div className="careers-filters__grid">
          <div className="form-group">
            <label htmlFor="department">Department</label>
            <select id="department" value={department} onChange={(e) => setDepartment(e.target.value)}>
              <option value="">All</option>
              {departments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="search">Search</label>
            <input id="search" type="search" placeholder="Search by title..." value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
        </div>
      </form>

      <div className="careers-list">
        {filtered.map((job) => (
          <article key={job.slug} className="careers-job-card">
            <div className="careers-card-main">
              <h3 className="position-title">{job.title}</h3>
              <p className="position-desc">{job.location} · {job.department}</p>
            </div>
            <div className="careers-card-aside">
              <Link href={`/careers-job/${job.slug}`} className="btn btn-outline btn-sm">View details</Link>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
