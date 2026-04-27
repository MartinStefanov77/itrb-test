
import { CareersPage } from "@/components/careers/CareersPage";
import type { CareersData } from "@/components/careers/types";
import { getPayload } from "payload";

import config from '@payload-config'

export default async function CareersRoute() {



  const payload = await getPayload({ config })

  const newJobPositions = await payload.find({
    collection: 'new-job-positions',
    locale: 'en'
  })   

  const careersData = {
    "hero": {
      "title": "Careers",
      "intro": "We provide opportunities for professionals at different stages of their journey."
    },
    "filters": {
      "departmentLabel": "Department",
      "departmentAllLabel": "All departments",
      "searchLabel": "Search",
      "searchPlaceholder": "Search by title..."
    },
    "jobs": newJobPositions.docs.map( job => ({
      "slug": job.slug,
        "title": job.title,
        "department": typeof job.department === "object" && job.department !== null
        ? job.department.title
        : "",
        "location": job.location,
    }))   
  }

  
  return <CareersPage data={careersData as CareersData} />;
}
