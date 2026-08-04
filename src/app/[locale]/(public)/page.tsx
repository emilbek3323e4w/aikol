import { getApprovedReviews } from "@/entities/review";
import { getSettingsMap } from "@/entities/settings";
import { getFeaturedMenuItems } from "@/entities/menu-item";
import { HomePage } from "@/views/home";

export default async function Home() {
  const [reviews, settings, featuredDishes] = await Promise.all([
    getApprovedReviews().catch(() => []),
    getSettingsMap(),
    getFeaturedMenuItems().catch(() => []),
  ]);
  return (
    <HomePage
      reviews={reviews}
      settings={settings}
      featuredDishes={featuredDishes}
    />
  );
}
