export type EventTypeSlug = "toi" | "corporate" | "quran" | "kids" | "other";

export const EVENT_TYPES: {
  slug: EventTypeSlug;
  enumValue: "TOI" | "CORPORATE" | "QURAN" | "KIDS" | "OTHER";
  icon: string;
}[] = [
  { slug: "toi", enumValue: "TOI", icon: "🎉" },
  { slug: "corporate", enumValue: "CORPORATE", icon: "💼" },
  { slug: "quran", enumValue: "QURAN", icon: "🕌" },
  { slug: "kids", enumValue: "KIDS", icon: "🎈" },
  { slug: "other", enumValue: "OTHER", icon: "✨" },
];
