"use client";

import { CareersPage } from "@/components/careers/CareersPage";
import type { CareersData } from "@/components/careers/types";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";

export default function CareersRoute() {
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

  const careersData = {
    hero: {
      title: "Careers",
      intro:
        "We provide opportunities for professionals at different stages of their journey.",
    },
    filters: {
      departmentLabel: "Department",
      departmentAllLabel: "All departments",
      searchLabel: "Search",
      searchPlaceholder: "Search by title...",
    },
    jobs: (newJobPositions as any[]).map((job) => ({
      slug: job.slug,
      title: job.title,
      department:
        typeof job.department === "object" && job.department !== null
          ? job.department.title
          : "",
      location: job.location,
    })),
  };

  return <CareersPage data={careersData as CareersData} />;
}
