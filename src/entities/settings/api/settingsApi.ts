import { unstable_cache, revalidateTag } from "next/cache";
import { prisma } from "@/shared/lib/prisma";
import { SETTINGS_KEYS, type SettingsKey, type SettingsMap } from "../model/keys";

const DEFAULTS: SettingsMap = {
  phone_primary: "+996707680614",
  phone_secondary: "+996704112299",
  whatsapp_number: "996707680614",
  address_ru: "г. Бишкек (точный адрес уточняется)",
  address_kg: "Бишкек ш. (так дареги тактоодо)",
  work_hours: "10:00 — 23:00",
  map_url: "",
  instagram_url: "https://instagram.com/aikol_restaurant",
  hero_title_ru: "Ресторан «Айкөл»",
  hero_title_kg: "«Айкөл» ресторону",
  hero_subtitle_ru: "Банкетный зал до 300 гостей",
  hero_subtitle_kg: "300 конокко чейинки банкет залы",
};

async function fetchSettingsMap(): Promise<SettingsMap> {
  const rows = await prisma.settings.findMany({
    where: { key: { in: [...SETTINGS_KEYS] } },
  });
  const map = { ...DEFAULTS };
  for (const row of rows) {
    map[row.key as SettingsKey] = row.value;
  }
  return map;
}

export const getSettingsMap = unstable_cache(fetchSettingsMap, ["settings-map"], {
  tags: ["settings"],
  revalidate: 3600,
});

export async function updateSettings(
  entries: Partial<SettingsMap>,
): Promise<void> {
  await Promise.all(
    Object.entries(entries).map(([key, value]) =>
      prisma.settings.upsert({
        where: { key },
        create: { key, value: value ?? "" },
        update: { value: value ?? "" },
      }),
    ),
  );
  revalidateTag("settings", "max");
}
