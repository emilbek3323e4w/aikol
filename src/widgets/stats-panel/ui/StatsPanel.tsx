import { Card } from "@/shared/ui/Card";

interface StatsPanelProps {
  pendingReviewsCount: number;
  packagesCount: number;
}

export function StatsPanel({
  pendingReviewsCount,
  packagesCount,
}: StatsPanelProps) {
  const items = [
    { label: "Отзывы на модерации", value: pendingReviewsCount },
    { label: "Пакетов", value: packagesCount },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label} className="p-5">
          <span className="block font-heading text-3xl text-gold">
            {item.value}
          </span>
          <span className="mt-1 block text-sm text-text-muted">
            {item.label}
          </span>
        </Card>
      ))}
    </div>
  );
}
