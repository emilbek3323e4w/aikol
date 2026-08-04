"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { MenuCard } from "@/entities/menu-item/ui/MenuCard";
import type { MenuCategory } from "@/entities/menu-item/model/types";
import { Lightbox } from "@/shared/ui/Lightbox";

interface MenuPageProps {
  categories: MenuCategory[];
}

export function MenuPage({ categories }: MenuPageProps) {
  const t = useTranslations("menuPage");
  const locale = useLocale();
  const categoriesWithItems = useMemo(
    () => categories.filter((c) => c.items.length > 0),
    [categories],
  );
  const [activeId, setActiveId] = useState<string>(
    categoriesWithItems[0]?.id ?? "",
  );
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (categoriesWithItems.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-24 text-center text-text-muted">
        {t("empty")}
      </div>
    );
  }

  const activeCategory =
    categoriesWithItems.find((c) => c.id === activeId) ??
    categoriesWithItems[0];

  const itemsWithImages = activeCategory.items.filter((item) => item.image);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <h1 className="mb-8 text-center font-heading text-4xl text-gold">
        {t("title")}
      </h1>

      <div className="sticky top-20 z-10 mb-8 flex gap-2 overflow-x-auto bg-bg/90 py-2 backdrop-blur-md">
        {categoriesWithItems.map((category) => {
          const name = locale === "kg" ? category.nameKg : category.name;
          const isActive = category.id === activeCategory.id;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveId(category.id)}
              className={`flex min-h-11 shrink-0 items-center gap-2 rounded-lg py-2 text-sm transition-colors ${
                category.image ? "pl-2 pr-4" : "px-4"
              } ${
                isActive
                  ? "bg-gold text-on-gold font-medium"
                  : "bg-bg-secondary text-text-muted hover:text-text"
              }`}
            >
              {category.image && (
                <span className="relative block h-7 w-7 shrink-0 overflow-hidden rounded-full">
                  <Image
                    src={category.image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="28px"
                  />
                </span>
              )}
              {name}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {activeCategory.items.map((item) => (
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
    </div>
  );
}
