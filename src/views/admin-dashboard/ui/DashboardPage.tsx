import { StatsPanel } from "@/widgets/stats-panel";

interface DashboardPageProps {
  pendingReviewsCount: number;
  packagesCount: number;
}

export function DashboardPage({
  pendingReviewsCount,
  packagesCount,
}: DashboardPageProps) {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-heading text-2xl text-gold">Dashboard</h1>

      <StatsPanel
        pendingReviewsCount={pendingReviewsCount}
        packagesCount={packagesCount}
      />
    </div>
  );
}
