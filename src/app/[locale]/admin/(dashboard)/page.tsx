import { getPendingReviewsCount } from "@/entities/review";
import { getPackagesCount } from "@/entities/package";
import { DashboardPage } from "@/views/admin-dashboard";

export default async function AdminDashboard() {
  const [pendingReviewsCount, packagesCount] = await Promise.all([
    getPendingReviewsCount().catch(() => 0),
    getPackagesCount().catch(() => 0),
  ]);

  return (
    <DashboardPage
      pendingReviewsCount={pendingReviewsCount}
      packagesCount={packagesCount}
    />
  );
}
