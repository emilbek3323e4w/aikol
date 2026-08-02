"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Lightbox } from "@/shared/ui/Lightbox";
import { EVENT_TYPES } from "@/shared/config/constants";
import type { GalleryPhoto } from "@/entities/gallery-photo/model/types";

interface GalleryPageProps {
  photos: GalleryPhoto[];
}

export function GalleryPage({ photos }: GalleryPageProps) {
  const t = useTranslations("galleryPage");
  const tEvents = useTranslations("eventTypes");
  const [filter, setFilter] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = useMemo(
    () =>
      filter === "all"
        ? photos
        : photos.filter((p) => p.eventType === filter),
    [photos, filter],
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="mb-8 text-center font-heading text-4xl text-gold">
        {t("title")}
      </h1>

      <div className="mb-8 flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`min-h-11 rounded-lg px-4 py-2 text-sm ${
            filter === "all"
              ? "bg-gold text-on-gold font-medium"
              : "bg-bg-secondary text-text-muted"
          }`}
        >
          {t("all")}
        </button>
        {EVENT_TYPES.map((event) => (
          <button
            key={event.slug}
            type="button"
            onClick={() => setFilter(event.enumValue)}
            className={`min-h-11 rounded-lg px-4 py-2 text-sm ${
              filter === event.enumValue
                ? "bg-gold text-on-gold font-medium"
                : "bg-bg-secondary text-text-muted"
            }`}
          >
            {tEvents(event.enumValue)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-text-muted">{t("empty")}</p>
      ) : (
        <div className="columns-2 gap-3 sm:columns-3 lg:columns-4 [&>*]:mb-3">
          {filtered.map((photo, i) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setLightboxIndex(i)}
              className="relative block w-full overflow-hidden rounded-lg bg-surface-muted"
            >
              <Image
                src={photo.url}
                alt=""
                width={400}
                height={300}
                className="w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {lightboxIndex !== null && (
        <Lightbox
          images={filtered.map((p) => ({ url: p.url }))}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onIndexChange={setLightboxIndex}
        />
      )}
    </div>
  );
}
