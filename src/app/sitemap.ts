import type { MetadataRoute } from "next";
import { siteConfig } from "@/shared/config/site";
import { EVENT_TYPES } from "@/shared/config/constants";

const LOCALES = ["ru", "kg"] as const;
const STATIC_PATHS = [
  "",
  "/menu",
  "/packages",
  "/gallery",
  "/news",
  "/reviews",
  "/contacts",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const path of STATIC_PATHS) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${siteConfig.url}/${locale}${path}`,
        lastModified: new Date(),
      });
    }
  }

  for (const event of EVENT_TYPES) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${siteConfig.url}/${locale}/events/${event.slug}`,
        lastModified: new Date(),
      });
    }
  }

  return entries;
}
