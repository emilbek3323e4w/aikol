"use client";

import { useLocale, useTranslations } from "next-intl";
import { PackageCard } from "@/entities/package/ui/PackageCard";
import type { Package } from "@/entities/package/model/types";
import type { ExtraService } from "@/entities/extra-service/model/types";

interface PackagesPageProps {
  packages: Package[];
  extraServices: ExtraService[];
  whatsappNumber: string;
}

export function PackagesPage({
  packages,
  extraServices,
  whatsappNumber,
}: PackagesPageProps) {
  const t = useTranslations("packagesPage");
  const locale = useLocale();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="mb-8 text-center font-heading text-4xl text-gold">
        {t("title")}
      </h1>

      {packages.length === 0 ? (
        <p className="text-center text-text-muted">{t("empty")}</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              locale={locale}
              whatsappNumber={whatsappNumber}
            />
          ))}
        </div>
      )}

      {extraServices.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-6 text-center font-heading text-2xl text-gold">
            {t("extraServicesTitle")}
          </h2>
          <div className="mx-auto flex max-w-2xl flex-col gap-2">
            {extraServices.map((service) => {
              const name = locale === "kg" ? service.nameKg : service.name;
              return (
                <div
                  key={service.id}
                  className="flex items-center justify-between rounded-lg bg-bg-secondary px-4 py-3"
                >
                  <span className="text-text">{name}</span>
                  <span className="text-gold">
                    {service.priceNote ?? `${service.price} сом`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
