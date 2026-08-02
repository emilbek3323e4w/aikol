import { siteConfig } from "@/shared/config/site";

export function getPhoneHref(): string {
  return `tel:${siteConfig.phones[0]}`;
}

export function getWhatsappHref(text: string, number?: string): string {
  return `https://wa.me/${number ?? siteConfig.whatsappNumber}?text=${encodeURIComponent(text)}`;
}
