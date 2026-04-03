import { CropDashboard } from "@/components/crop-dashboard";
import { getCrops } from "@/lib/crop-service";
import type { CropSortMode } from "@/types/crop";

export const dynamic = "force-dynamic";

const defaultSortMode: CropSortMode = "profit_per_hour";

export default async function Home() {
  const crops = await getCrops(defaultSortMode);

  return <CropDashboard initialCrops={crops} initialSort={defaultSortMode} />;
}
