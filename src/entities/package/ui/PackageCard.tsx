import { Card } from "@/shared/ui/Card";
import { Button } from "@/shared/ui/Button";
import { getWhatsappHref } from "@/shared/lib/contact";
import type { Package } from "../model/types";

interface PackageCardProps {
  pkg: Package;
  locale: string;
  whatsappNumber: string;
}

export function PackageCard({ pkg, locale, whatsappNumber }: PackageCardProps) {
  const fixedItems = locale === "kg" ? pkg.fixedItemsKg : pkg.fixedItems;
  const whatsappHref = getWhatsappHref(
    `Здравствуйте, интересует пакет ${pkg.name}`,
    whatsappNumber,
  );

  return (
    <Card className="flex flex-col gap-4 p-6">
      <div>
        <span className="font-heading text-3xl text-gold">
          {pkg.pricePerGuest} сом
        </span>
        <span className="ml-1 text-sm text-text-muted">/ гостя</span>
      </div>

      {fixedItems.length > 0 && (
        <ul className="flex flex-col gap-1 text-sm text-text-muted">
          {fixedItems.map((item, i) => (
            <li key={i}>• {item}</li>
          ))}
        </ul>
      )}

      {pkg.selections.length > 0 && (
        <ul className="flex flex-col gap-1 text-sm text-gold">
          {pkg.selections.map((selection) => {
            const categoryName =
              locale === "kg"
                ? selection.category.nameKg
                : selection.category.name;
            return (
              <li key={selection.id}>
                {selection.quantity} {categoryName} на выбор
              </li>
            );
          })}
        </ul>
      )}

      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto"
      >
        <Button className="w-full">Уточнить</Button>
      </a>
    </Card>
  );
}
