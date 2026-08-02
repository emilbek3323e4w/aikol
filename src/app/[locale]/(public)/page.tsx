import { getApprovedReviews } from "@/entities/review";
import { getSettingsMap } from "@/entities/settings";
import { HomePage } from "@/views/home";

export default async function Home() {
  const [reviews, settings] = await Promise.all([
    getApprovedReviews().catch(() => []),
    getSettingsMap(),
  ]);
  return <HomePage reviews={reviews} settings={settings} />;
}
