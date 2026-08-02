import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/shared/i18n/routing";
import { ToastProvider } from "@/shared/ui/Toast";
import { siteConfig } from "@/shared/config/site";
import { buildMetadata } from "@/shared/lib/seo";
import "../globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "cyrillic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default:
        locale === "kg" ? "«Айкөл» ресторону" : "Ресторан «Айкөл»",
      template: `%s — Айкөл`,
    },
    ...buildMetadata({
      locale,
      path: "",
      title: locale === "kg" ? "«Айкөл» ресторону" : "Ресторан «Айкөл»",
      description:
        locale === "kg"
          ? "300 конокко чейинки банкет залы"
          : "Банкетный зал до 300 гостей в Бишкеке",
    }),
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html
      lang={locale}
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider>
          <ToastProvider>{children}</ToastProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
