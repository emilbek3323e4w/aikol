export function formatDate(date: Date | string, locale: string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale === "kg" ? "ky-KG" : "ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

export function toDateOnlyString(date: Date): string {
  return date.toISOString().slice(0, 10);
}
