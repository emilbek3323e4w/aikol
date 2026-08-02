"use client";

import { useState } from "react";
import { Modal } from "@/shared/ui/Modal";
import { Input } from "@/shared/ui/Input";
import { Button } from "@/shared/ui/Button";
import { useToast } from "@/shared/ui/Toast";
import type { ExtraService } from "@/entities/extra-service/model/types";

interface ExtraServiceFormModalProps {
  open: boolean;
  onClose: () => void;
  editService?: ExtraService | null;
  onSaved: () => void;
}

export function ExtraServiceFormModal({
  open,
  onClose,
  editService,
  onSaved,
}: ExtraServiceFormModalProps) {
  const { showToast } = useToast();
  const [name, setName] = useState(editService?.name ?? "");
  const [nameKg, setNameKg] = useState(editService?.nameKg ?? "");
  const [price, setPrice] = useState(editService?.price ?? 0);
  const [priceNote, setPriceNote] = useState(editService?.priceNote ?? "");
  const [saving, setSaving] = useState(false);

  const isEdit = Boolean(editService);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      name,
      nameKg,
      price: Number(price),
      priceNote: priceNote || undefined,
    };

    const res = await fetch(
      isEdit ? `/api/extra-services/${editService!.id}` : "/api/extra-services",
      {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    setSaving(false);

    if (res.ok) {
      showToast(isEdit ? "Услуга обновлена" : "Услуга добавлена", "success");
      onSaved();
      onClose();
    } else {
      showToast("Не удалось сохранить услугу", "error");
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Редактировать услугу" : "Добавить услугу"}
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

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Цена (сом)"
            type="number"
            min={0}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            required
          />
          <Input
            label="Диапазон цены (опционально)"
            placeholder="например 1500-1000"
            value={priceNote}
            onChange={(e) => setPriceNote(e.target.value)}
          />
        </div>

        <Button type="submit" disabled={saving}>
          {isEdit ? "Сохранить" : "Добавить"}
        </Button>
      </form>
    </Modal>
  );
}
