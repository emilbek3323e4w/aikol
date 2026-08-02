export const SETTINGS_KEYS = [
  "phone_primary",
  "phone_secondary",
  "whatsapp_number",
  "address_ru",
  "address_kg",
  "work_hours",
  "map_url",
  "instagram_url",
  "hero_title_ru",
  "hero_title_kg",
  "hero_subtitle_ru",
  "hero_subtitle_kg",
] as const;

export type SettingsKey = (typeof SETTINGS_KEYS)[number];

export type SettingsMap = Record<SettingsKey, string>;

export const SETTINGS_GROUPS: { title: string; keys: SettingsKey[] }[] = [
  {
    title: "Контакты",
    keys: ["phone_primary", "phone_secondary", "whatsapp_number", "address_ru", "address_kg", "instagram_url"],
  },
  {
    title: "Режим работы",
    keys: ["work_hours", "map_url"],
  },
  {
    title: "Главная страница",
    keys: ["hero_title_ru", "hero_title_kg", "hero_subtitle_ru", "hero_subtitle_kg"],
  },
];

export const SETTINGS_LABELS: Record<SettingsKey, string> = {
  phone_primary: "Основной телефон",
  phone_secondary: "Дополнительный телефон",
  whatsapp_number: "Номер WhatsApp",
  address_ru: "Адрес (RU)",
  address_kg: "Адрес (KG)",
  work_hours: "Часы работы",
  map_url: "Ссылка на карту",
  instagram_url: "Instagram",
  hero_title_ru: "Заголовок (RU)",
  hero_title_kg: "Заголовок (KG)",
  hero_subtitle_ru: "Подзаголовок (RU)",
  hero_subtitle_kg: "Подзаголовок (KG)",
};
