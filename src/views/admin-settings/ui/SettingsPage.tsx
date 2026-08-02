"use client";

import { useEffect, useState } from "react";
import { Input } from "@/shared/ui/Input";
import { Button } from "@/shared/ui/Button";
import { Spinner } from "@/shared/ui/Spinner";
import { useToast } from "@/shared/ui/Toast";
import { SETTINGS_GROUPS, SETTINGS_LABELS } from "@/entities/settings/model/keys";
import type { SettingsMap } from "@/entities/settings/model/keys";

export function SettingsPage() {
  const { showToast } = useToast();
  const [settings, setSettings] = useState<SettingsMap | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const res = await fetch("/api/settings");
    const json = await res.json();
    if (json.success) setSettings(json.data);
  };

  useEffect(() => {
    void Promise.resolve().then(() => load());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    showToast(res.ok ? "Настройки сохранены" : "Не удалось сохранить", res.ok ? "success" : "error");
  };

  if (!settings) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 font-heading text-2xl text-gold">Настройки</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        {SETTINGS_GROUPS.map((group) => (
          <div key={group.title}>
            <h2 className="mb-3 text-sm uppercase tracking-wide text-text-muted">
              {group.title}
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {group.keys.map((key) => (
                <Input
                  key={key}
                  label={SETTINGS_LABELS[key]}
                  value={settings[key]}
                  onChange={(e) =>
                    setSettings((prev) => (prev ? { ...prev, [key]: e.target.value } : prev))
                  }
                />
              ))}
            </div>
          </div>
        ))}

        <Button type="submit" disabled={saving}>
          Сохранить
        </Button>
      </form>
    </div>
  );
}
