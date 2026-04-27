"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CareersJob } from "./types";
import styles from "./CareersJobsList.module.scss";

type FiltersCopy = {
  departmentLabel: string;
  departmentAllLabel: string;
  searchLabel: string;
  searchPlaceholder: string;
};

export function CareersJobsList({ jobs, filters }: { jobs: CareersJob[]; filters: FiltersCopy }) {
  const [department, setDepartment] = useState("");
  const [query, setQuery] = useState("");
  const [deptOpen, setDeptOpen] = useState(false);
  const deptDropdownRef = useRef<HTMLDivElement | null>(null);

  const departments = useMemo(
    () => [...new Set(jobs.map((job) => job.department))].sort((a, b) => a.localeCompare(b)),
    [jobs]
  );

  const filteredJobs = useMemo(() => {
    const q = query.trim().toLowerCase();
    return jobs.filter((job) => {
      const matchesDepartment = !department || job.department === department;
      const matchesSearch = !q || `${job.title}`.toLowerCase().includes(q);
      return matchesDepartment && matchesSearch;
    });
  }, [jobs, department, query]);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!deptDropdownRef.current) return;
      const target = event.target as Node;
      if (!deptDropdownRef.current.contains(target)) {
        setDeptOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDeptOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <>
      <form className={`careers-filters ${styles.filters}`} onSubmit={(e) => e.preventDefault()}>
        <div className="careers-filters__grid">
          <div className="careers-filters__field">
            <label className="careers-filters__label" htmlFor="careers-dd-dept-trigger">
              {filters.departmentLabel}
            </label>
            <div className={`careers-dd ${deptOpen ? "is-open" : ""}`} ref={deptDropdownRef}>
              <div className="careers-dd__bar">
                <button
                  type="button"
                  className="careers-dd__open"
                  id="careers-dd-dept-trigger"
                  aria-haspopup="listbox"
                  aria-expanded={deptOpen ? "true" : "false"}
                  aria-controls="careers-dd-dept-list"
                  onClick={() => setDeptOpen((v) => !v)}
                >
                  <span className="careers-dd__value">{department || filters.departmentAllLabel}</span>
                </button>
                <button
                  type="button"
                  className={`careers-field-clear ${department ? "is-visible" : ""}`}
                  aria-label="Clear department filter"
                  aria-hidden={department ? "false" : "true"}
                  tabIndex={department ? 0 : -1}
                  onClick={() => {
                    setDepartment("");
                    setDeptOpen(false);
                  }}
                >
                  ×
                </button>
                <button
                  type="button"
                  className="careers-dd__chevron-btn"
                  tabIndex={-1}
                  aria-hidden="true"
                  onClick={() => setDeptOpen((v) => !v)}
                >
                  <span className="careers-dd__chevron" aria-hidden="true"></span>
                </button>
              </div>

              <ul
                id="careers-dd-dept-list"
                className="careers-dd__panel careers-floating-panel"
                role="listbox"
                hidden={!deptOpen}
              >
                <li
                  role="option"
                  className={`careers-dd__option ${department === "" ? "is-selected" : ""}`}
                  aria-selected={department === "" ? "true" : "false"}
                  onClick={() => {
                    setDepartment("");
                    setDeptOpen(false);
                  }}
                >
                  {filters.departmentAllLabel}
                </li>
                {departments.map((value) => (
                  <li
                    key={value}
                    role="option"
                    className={`careers-dd__option ${department === value ? "is-selected" : ""}`}
                    aria-selected={department === value ? "true" : "false"}
                    onClick={() => {
                      setDepartment(value);
                      setDeptOpen(false);
                    }}
                  >
                    {value}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="careers-filters__field careers-filters__field--search">
            <label className="careers-filters__label" htmlFor="careers-search">
              {filters.searchLabel}
            </label>
            <input
              id="careers-search"
              className="careers-search-input"
              type="search"
              placeholder={filters.searchPlaceholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
      </form>

      <div className={`careers-list ${styles.results}`}>
        {filteredJobs.map((job) => (
          <article key={job.slug} className="careers-job-card">
            <div className="careers-card-main">
              <h3 className="position-title">{job.title}</h3>
              <p className="position-desc">
                {job.location} · {job.department}
              </p>
            </div>
            <div className="careers-card-aside">
              <Link href={`/careers-job/${job.slug}`} className="btn btn-outline btn-sm">
                View details
              </Link>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
