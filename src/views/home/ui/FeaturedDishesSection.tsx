"use client";

import { useState } from "react";
import { Link } from "@/shared/i18n/navigation";
import { MenuCard } from "@/entities/menu-item/ui/MenuCard";
import type { MenuItem } from "@/entities/menu-item/model/types";
import { Lightbox } from "@/shared/ui/Lightbox";

interface FeaturedDishesSectionProps {
  dishes: MenuItem[];
  locale: string;
  title: string;
  cta: string;
}

export function FeaturedDishesSection({
  dishes,
  locale,
  title,
  cta,
}: FeaturedDishesSectionProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const itemsWithImages = dishes.filter((item) => item.image);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-heading text-3xl text-gold">{title}</h2>
        <Link
          href="/menu"
          className="shrink-0 text-sm text-gold hover:underline"
        >
          {cta} →
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-6">
        {dishes.map((item) => (
          <MenuCard
            key={item.id}
            item={item}
            locale={locale}
            onImageClick={
              item.image
                ? () =>
                    setLightboxIndex(
                      itemsWithImages.findIndex((i) => i.id === item.id),
                    )
                : undefined
            }
          />
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={itemsWithImages.map((item) => ({
            url: item.image!,
            alt: locale === "kg" ? item.nameKg : item.name,
          }))}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onIndexChange={setLightboxIndex}
        />
      )}
    </section>
  );
}
