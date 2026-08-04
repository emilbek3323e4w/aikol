"use client";

import { useEffect, useState } from "react";
import { Button } from "@/shared/ui/Button";
import { Spinner } from "@/shared/ui/Spinner";
import { useToast } from "@/shared/ui/Toast";
import { PackageFormModal } from "@/features/add-package";
import { ExtraServiceFormModal } from "@/features/manage-extra-service";
import type { Package } from "@/entities/package/model/types";
import type { ExtraService } from "@/entities/extra-service/model/types";

interface CategoryOption {
  id: string;
  name: string;
}

export function PackagesManagementPage() {
  const { showToast } = useToast();
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [extraServices, setExtraServices] = useState<ExtraService[]>([]);
  const [loading, setLoading] = useState(true);

  const [packageModalOpen, setPackageModalOpen] = useState(false);
  const [editPackage, setEditPackage] = useState<Package | null>(null);

  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editService, setEditService] = useState<ExtraService | null>(null);

  const loadAll = async () => {
    setLoading(true);
    const [categoriesRes, packagesRes, servicesRes] = await Promise.all([
      fetch("/api/menu?all=true"),
      fetch("/api/packages?all=true"),
      fetch("/api/extra-services?all=true"),
    ]);
    const categoriesJson = await categoriesRes.json();
    const packagesJson = await packagesRes.json();
    const servicesJson = await servicesRes.json();

    if (categoriesJson.success) {
      setCategories(
        categoriesJson.data.map((c: { id: string; name: string }) => ({
          id: c.id,
          name: c.name,
        })),
      );
    }
    if (packagesJson.success) setPackages(packagesJson.data);
    if (servicesJson.success) setExtraServices(servicesJson.data);

    setLoading(false);
  };

  useEffect(() => {
    void Promise.resolve().then(() => loadAll());
  }, []);

  const handleTogglePackageAvailable = async (pkg: Package) => {
    setPackages((prev) =>
      prev.map((p) => (p.id === pkg.id ? { ...p, isAvailable: !p.isAvailable } : p)),
    );
    const res = await fetch(`/api/packages/${pkg.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isAvailable: !pkg.isAvailable }),
    });
    if (!res.ok) {
      showToast("Не удалось изменить доступность", "error");
      loadAll();
    }
  };

  const handleDeletePackage = async (pkg: Package) => {
    if (!confirm(`Удалить пакет «${pkg.name}»?`)) return;
    const res = await fetch(`/api/packages/${pkg.id}`, { method: "DELETE" });
    if (res.ok) {
      showToast("Пакет удалён", "success");
      loadAll();
    } else {
      showToast("Не удалось удалить пакет", "error");
    }
  };

  const handleToggleServiceAvailable = async (service: ExtraService) => {
    setExtraServices((prev) =>
      prev.map((s) =>
        s.id === service.id ? { ...s, isAvailable: !s.isAvailable } : s,
      ),
    );
    const res = await fetch(`/api/extra-services/${service.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isAvailable: !service.isAvailable }),
    });
    if (!res.ok) {
      showToast("Не удалось изменить доступность", "error");
      loadAll();
    }
  };

  const handleDeleteService = async (service: ExtraService) => {
    if (!confirm(`Удалить услугу «${service.name}»?`)) return;
    const res = await fetch(`/api/extra-services/${service.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      showToast("Услуга удалена", "success");
      loadAll();
    } else {
      showToast("Не удалось удалить услугу", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12">
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-heading text-2xl text-gold">Пакеты</h1>
          <Button
            onClick={() => {
              setEditPackage(null);
              setPackageModalOpen(true);
            }}
          >
            + Добавить пакет
          </Button>
        </div>

        {packages.length === 0 ? (
          <p className="text-text-muted">Пакетов пока нет</p>
        ) : (
          <div className="flex flex-col gap-3">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="flex items-center gap-4 rounded-lg bg-bg-secondary p-3"
              >
                <div className="flex-1">
                  <p className="text-text">{pkg.name}</p>
                  <p className="text-sm text-text-muted">
                    {pkg.pricePerGuest} сом / гостя
                  </p>
                </div>
                <label className="flex items-center gap-2 text-xs text-text-muted">
                  <input
                    type="checkbox"
                    checked={pkg.isAvailable}
                    onChange={() => handleTogglePackageAvailable(pkg)}
                    className="h-4 w-4 accent-gold"
                  />
                  Доступен
                </label>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setEditPackage(pkg);
                    setPackageModalOpen(true);
                  }}
                >
                  Изменить
                </Button>
                <Button variant="ghost" onClick={() => handleDeletePackage(pkg)}>
                  Удалить
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-heading text-xl text-gold">Дополнительные услуги</h2>
          <Button
            variant="secondary"
            onClick={() => {
              setEditService(null);
              setServiceModalOpen(true);
            }}
          >
            + Добавить услугу
          </Button>
        </div>

        {extraServices.length === 0 ? (
          <p className="text-text-muted">Услуг пока нет</p>
        ) : (
          <div className="flex flex-col gap-3">
            {extraServices.map((service) => (
              <div
                key={service.id}
                className="flex items-center gap-4 rounded-lg bg-bg-secondary p-3"
              >
                <div className="flex-1">
                  <p className="text-text">{service.name}</p>
                  <p className="text-sm text-text-muted">
                    {service.priceNote ?? `${service.price} сом`}
                  </p>
                </div>
                <label className="flex items-center gap-2 text-xs text-text-muted">
                  <input
                    type="checkbox"
                    checked={service.isAvailable}
                    onChange={() => handleToggleServiceAvailable(service)}
                    className="h-4 w-4 accent-gold"
                  />
                  Доступна
                </label>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setEditService(service);
                    setServiceModalOpen(true);
                  }}
                >
                  Изменить
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => handleDeleteService(service)}
                >
                  Удалить
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {packageModalOpen && (
        <PackageFormModal
          open={packageModalOpen}
          onClose={() => setPackageModalOpen(false)}
          categories={categories}
          allPackages={packages}
          editPackage={editPackage}
          onSaved={loadAll}
        />
      )}

      {serviceModalOpen && (
        <ExtraServiceFormModal
          open={serviceModalOpen}
          onClose={() => setServiceModalOpen(false)}
          editService={editService}
          onSaved={loadAll}
        />
      )}
    </div>
  );
}
