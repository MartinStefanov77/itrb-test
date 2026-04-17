import whoWeAreData from "@/data/who-we-are.json";
import { WhoWeArePage } from "@/components/whoWeAre/WhoWeArePage";

export default function WhoWeAreRoute() {
  return <WhoWeArePage data={whoWeAreData} />;
}
