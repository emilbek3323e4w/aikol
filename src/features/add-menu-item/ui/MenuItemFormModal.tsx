"use client";

import { useState } from "react";
import { Modal } from "@/shared/ui/Modal";
import { Input } from "@/shared/ui/Input";
import { Select } from "@/shared/ui/Select";
import { Button } from "@/shared/ui/Button";
import { UploadDropzone } from "@/features/upload-photo";
import { useToast } from "@/shared/ui/Toast";
import type { MenuCategory, MenuItem } from "@/entities/menu-item/model/types";

interface MenuItemFormModalProps {
  open: boolean;
  onClose: () => void;
  categories: MenuCategory[];
  defaultCategoryId: string;
  editItem?: MenuItem | null;
  onSaved: () => void;
}

export function MenuItemFormModal({
  open,
  onClose,
  categories,
  defaultCategoryId,
  editItem,
  onSaved,
}: MenuItemFormModalProps) {
  const { showToast } = useToast();
  const [name, setName] = useState(editItem?.name ?? "");
  const [nameKg, setNameKg] = useState(editItem?.nameKg ?? "");
  const [categoryId, setCategoryId] = useState(
    editItem?.categoryId ?? defaultCategoryId,
  );
  const [image, setImage] = useState(editItem?.image ?? "");
  const [isFeatured, setIsFeatured] = useState(editItem?.isFeatured ?? false);
  const [saving, setSaving] = useState(false);

  const isEdit = Boolean(editItem);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      name,
      nameKg,
      image: image || undefined,
      isFeatured,
      categoryId,
    };

    const res = await fetch(
      isEdit ? `/api/menu/${editItem!.id}` : "/api/menu",
      {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    setSaving(false);

    if (res.ok) {
      showToast(isEdit ? "Блюдо обновлено" : "Блюдо добавлено", "success");
      onSaved();
      onClose();
    } else {
      showToast("Не удалось сохранить блюдо", "error");
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Редактировать блюдо" : "Добавить блюдо"}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Название (RU)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="Название (KG)"
            value={nameKg}
            onChange={(e) => setNameKg(e.target.value)}
            required
          />
        </div>

        <Select
          label="Категория"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          options={categories.map((c) => ({ value: c.id, label: c.name }))}
        />

        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" className="h-32 w-full rounded-lg object-cover" />
        )}
        <UploadDropzone onUploaded={(r) => setImage(r.url)} />

        <label className="flex items-center gap-2 text-sm text-text-muted">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="h-4 w-4 accent-gold"
          />
          Показывать в «Популярных» на главной
        </label>

        <Button type="submit" disabled={saving}>
          {isEdit ? "Сохранить" : "Добавить"}
        </Button>
      </form>
    </Modal>
  );
}
