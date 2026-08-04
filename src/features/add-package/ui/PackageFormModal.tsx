"use client";

import { useState } from "react";
import { Modal } from "@/shared/ui/Modal";
import { Input } from "@/shared/ui/Input";
import { Select } from "@/shared/ui/Select";
import { Button } from "@/shared/ui/Button";
import { useToast } from "@/shared/ui/Toast";
import type { Package } from "@/entities/package/model/types";

interface CategoryOption {
  id: string;
  name: string;
}

interface FixedItemRow {
  ru: string;
  kg: string;
}

interface SelectionRow {
  categoryId: string;
  quantity: number;
}

interface PackageFormModalProps {
  open: boolean;
  onClose: () => void;
  categories: CategoryOption[];
  allPackages?: Package[];
  editPackage?: Package | null;
  onSaved: () => void;
}

export function PackageFormModal({
  open,
  onClose,
  categories,
  allPackages = [],
  editPackage,
  onSaved,
}: PackageFormModalProps) {
  const { showToast } = useToast();
  const [name, setName] = useState(editPackage?.name ?? "");
  const [pricePerGuest, setPricePerGuest] = useState(
    editPackage?.pricePerGuest ?? 0,
  );
  const [fixedItemRows, setFixedItemRows] = useState<FixedItemRow[]>(
    editPackage
      ? editPackage.fixedItems.map((ru, i) => ({
          ru,
          kg: editPackage.fixedItemsKg[i] ?? "",
        }))
      : [],
  );
  const [selectionRows, setSelectionRows] = useState<SelectionRow[]>(
    editPackage
      ? editPackage.selections.map((s) => ({
          categoryId: s.categoryId,
          quantity: s.quantity,
        }))
      : [],
  );
  const [saving, setSaving] = useState(false);
  const [copySourceId, setCopySourceId] = useState("");

  const isEdit = Boolean(editPackage);

  const copyCandidates = allPackages.filter((p) => p.id !== editPackage?.id);

  const handleCopyFixedItems = () => {
    const source = copyCandidates.find((p) => p.id === copySourceId);
    if (!source) return;
    const rows = source.fixedItems.map((ru, i) => ({
      ru,
      kg: source.fixedItemsKg[i] ?? "",
    }));
    setFixedItemRows((prev) => {
      const hasContent = prev.some((row) => row.ru.trim() || row.kg.trim());
      return hasContent ? [...prev, ...rows] : rows;
    });
  };

  const addFixedItemRow = () =>
    setFixedItemRows((prev) => [...prev, { ru: "", kg: "" }]);
  const removeFixedItemRow = (index: number) =>
    setFixedItemRows((prev) => prev.filter((_, i) => i !== index));
  const updateFixedItemRow = (
    index: number,
    field: "ru" | "kg",
    value: string,
  ) =>
    setFixedItemRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    );

  const addSelectionRow = () =>
    setSelectionRows((prev) => [
      ...prev,
      { categoryId: categories[0]?.id ?? "", quantity: 1 },
    ]);
  const removeSelectionRow = (index: number) =>
    setSelectionRows((prev) => prev.filter((_, i) => i !== index));
  const updateSelectionRow = (
    index: number,
    field: "categoryId" | "quantity",
    value: string | number,
  ) =>
    setSelectionRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const rows = fixedItemRows.filter((r) => r.ru.trim() || r.kg.trim());

    const payload = {
      name,
      pricePerGuest: Number(pricePerGuest),
      fixedItems: rows.map((r) => r.ru),
      fixedItemsKg: rows.map((r) => r.kg),
      selections: selectionRows.filter((r) => r.categoryId),
    };

    const res = await fetch(
      isEdit ? `/api/packages/${editPackage!.id}` : "/api/packages",
      {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    setSaving(false);

    if (res.ok) {
      showToast(isEdit ? "Пакет обновлён" : "Пакет добавлен", "success");
      onSaved();
      onClose();
    } else {
      showToast("Не удалось сохранить пакет", "error");
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Редактировать пакет" : "Добавить пакет"}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Название (для админки)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="Цена за гостя (сом)"
            type="number"
            min={0}
            value={pricePerGuest}
            onChange={(e) => setPricePerGuest(Number(e.target.value))}
            required
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-text-muted">Фиксированные позиции</span>
            <Button type="button" variant="ghost" onClick={addFixedItemRow}>
              + Добавить позицию
            </Button>
          </div>

          {copyCandidates.length > 0 && (
            <div className="mb-3 flex items-center gap-2">
              <div className="flex-1">
                <Select
                  value={copySourceId}
                  onChange={(e) => setCopySourceId(e.target.value)}
                  options={copyCandidates.map((p) => ({
                    value: p.id,
                    label: `${p.name} (${p.pricePerGuest} сом)`,
                  }))}
                  placeholder="Скопировать из пакета..."
                />
              </div>
              <Button
                type="button"
                variant="secondary"
                onClick={handleCopyFixedItems}
                disabled={!copySourceId}
              >
                Копировать
              </Button>
            </div>
          )}

          <div className="flex flex-col gap-2">
            {fixedItemRows.map((row, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="RU"
                    value={row.ru}
                    onChange={(e) =>
                      updateFixedItemRow(i, "ru", e.target.value)
                    }
                  />
                </div>
                <div className="flex-1">
                  <Input
                    placeholder="KG"
                    value={row.kg}
                    onChange={(e) =>
                      updateFixedItemRow(i, "kg", e.target.value)
                    }
                  />
                </div>
                <button
                  type="button"
                  aria-label="Удалить позицию"
                  onClick={() => removeFixedItemRow(i)}
                  className="flex h-11 w-9 shrink-0 items-center justify-center text-text-muted hover:text-danger"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-text-muted">Блоки «на выбор»</span>
            <Button
              type="button"
              variant="ghost"
              onClick={addSelectionRow}
              disabled={categories.length === 0}
            >
              + Добавить блок выбора
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            {selectionRows.map((row, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="flex-1">
                  <Select
                    value={row.categoryId}
                    onChange={(e) =>
                      updateSelectionRow(i, "categoryId", e.target.value)
                    }
                    options={categories.map((c) => ({
                      value: c.id,
                      label: c.name,
                    }))}
                  />
                </div>
                <div className="w-24">
                  <Input
                    type="number"
                    min={1}
                    value={row.quantity}
                    onChange={(e) =>
                      updateSelectionRow(i, "quantity", Number(e.target.value))
                    }
                  />
                </div>
                <button
                  type="button"
                  aria-label="Удалить блок выбора"
                  onClick={() => removeSelectionRow(i)}
                  className="flex h-11 w-9 shrink-0 items-center justify-center text-text-muted hover:text-danger"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        <Button type="submit" disabled={saving}>
          {isEdit ? "Сохранить" : "Добавить"}
        </Button>
      </form>
    </Modal>
  );
}
