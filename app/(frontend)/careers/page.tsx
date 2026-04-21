import careersData from "@/data/careers.json";
import { CareersPage } from "@/components/careers/CareersPage";
import type { CareersData } from "@/components/careers/types";

export default function CareersRoute() {
  return <CareersPage data={careersData as CareersData} />;
}
