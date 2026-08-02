"use client";

import { useState } from "react";
import { Modal } from "@/shared/ui/Modal";
import { Input } from "@/shared/ui/Input";
import { Textarea } from "@/shared/ui/Textarea";
import { Button } from "@/shared/ui/Button";
import { UploadDropzone } from "@/features/upload-photo";
import { useToast } from "@/shared/ui/Toast";
import type { News } from "@/entities/news/model/types";

interface NewsFormModalProps {
  open: boolean;
  onClose: () => void;
  editNews?: News | null;
  onSaved: () => void;
}

export function NewsFormModal({ open, onClose, editNews, onSaved }: NewsFormModalProps) {
  const { showToast } = useToast();
  const [title, setTitle] = useState(editNews?.title ?? "");
  const [titleKg, setTitleKg] = useState(editNews?.titleKg ?? "");
  const [body, setBody] = useState(editNews?.body ?? "");
  const [bodyKg, setBodyKg] = useState(editNews?.bodyKg ?? "");
  const [image, setImage] = useState(editNews?.image ?? "");
  const [saving, setSaving] = useState(false);

  const isEdit = Boolean(editNews);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const res = await fetch(isEdit ? `/api/news/${editNews!.id}` : "/api/news", {
      method: isEdit ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        titleKg,
        body,
        bodyKg,
        image: image || undefined,
      }),
    });

    setSaving(false);

    if (res.ok) {
      showToast(isEdit ? "Новость обновлена" : "Новость создана", "success");
      onSaved();
      onClose();
    } else {
      showToast("Не удалось сохранить новость", "error");
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? "Редактировать новость" : "Новая новость"}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Input label="Заголовок (RU)" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <Input label="Заголовок (KG)" value={titleKg} onChange={(e) => setTitleKg(e.target.value)} required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Textarea label="Текст (RU)" value={body} onChange={(e) => setBody(e.target.value)} required />
          <Textarea label="Текст (KG)" value={bodyKg} onChange={(e) => setBodyKg(e.target.value)} required />
        </div>

        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" className="h-32 w-full rounded-lg object-cover" />
        )}
        <UploadDropzone onUploaded={(r) => setImage(r.url)} />

        <Button type="submit" disabled={saving}>
          {isEdit ? "Сохранить" : "Создать"}
        </Button>
      </form>
    </Modal>
  );
}
