import type { Metadata } from "next";
import { siteConfig } from "@/shared/config/site";

interface BuildMetadataInput {
  locale: string;
  path: string;
  title: string;
  description: string;
  image?: string;
}

export function buildMetadata({
  locale,
  path,
  title,
  description,
  image,
}: BuildMetadataInput): Metadata {
  const url = `${siteConfig.url}/${locale}${path}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        ru: `${siteConfig.url}/ru${path}`,
        kg: `${siteConfig.url}/kg${path}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: locale === "kg" ? "ky_KG" : "ru_RU",
      type: "website",
      images: image ? [{ url: image }] : undefined,
    },
  };
}
