import type { Metadata } from "next";
import { getPackages } from "@/entities/package";
import { getExtraServices } from "@/entities/extra-service";
import { getSettingsMap } from "@/entities/settings";
import { PackagesPage } from "@/views/packages";
import { buildMetadata } from "@/shared/lib/seo";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale,
    path: "/packages",
    title: "Банкетные пакеты",
    description:
      locale === "kg"
        ? "«Айкөл» ресторонунун банкеттик пакеттери"
        : "Банкетные пакеты ресторана «Айкөл» — цена за гостя",
  });
}

export default async function Packages() {
  const [packages, extraServices, settings] = await Promise.all([
    getPackages().catch(() => []),
    getExtraServices().catch(() => []),
    getSettingsMap().catch(() => null),
  ]);

  return (
    <PackagesPage
      packages={packages}
      extraServices={extraServices}
      whatsappNumber={settings?.whatsapp_number ?? "996707680614"}
    />
  );
}
