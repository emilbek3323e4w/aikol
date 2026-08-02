import Image from "next/image";
import { Card } from "@/shared/ui/Card";
import type { MenuItem } from "../model/types";

interface MenuCardProps {
  item: MenuItem;
  locale: string;
  onImageClick?: () => void;
}

export function MenuCard({ item, locale, onImageClick }: MenuCardProps) {
  const name = locale === "kg" ? item.nameKg : item.name;

  return (
    <Card>
      <div className="relative aspect-4/3 bg-surface-muted">
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
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            </button>
          ) : (
            <Image
              src={item.image}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          ))}
      </div>
      <div className="flex flex-col gap-1 p-4">
        <h3 className="font-heading text-lg text-text">{name}</h3>
      </div>
    </Card>
  );
}
