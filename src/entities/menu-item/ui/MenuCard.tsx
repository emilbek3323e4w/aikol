import Image from "next/image";
import type { MenuItem } from "../model/types";

interface MenuCardProps {
  item: MenuItem;
  locale: string;
  onImageClick?: () => void;
}

export function MenuCard({ item, locale, onImageClick }: MenuCardProps) {
  const name = locale === "kg" ? item.nameKg : item.name;

  return (
    <div className="relative aspect-3/4 min-w-0 overflow-hidden rounded-2xl bg-surface-muted">
      {item.image &&
        (onImageClick ? (
          <button
            type="button"
            onClick={onImageClick}
            aria-label={name}
            className="absolute inset-0 cursor-zoom-in"
          >
            <Image
              src={item.image}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, 240px"
            />
          </button>
        ) : (
          <Image
            src={item.image}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, 240px"
          />
        ))}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/75 to-60% to-transparent" />
      <h3 className="pointer-events-none absolute inset-x-0 bottom-0 w-full truncate px-5 pb-5 font-heading text-xl font-bold text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.5)] sm:text-2xl">
        {name}
      </h3>
    </div>
  );
}
