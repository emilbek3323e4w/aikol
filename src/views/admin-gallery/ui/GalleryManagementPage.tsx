"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Select } from "@/shared/ui/Select";
import { Spinner } from "@/shared/ui/Spinner";
import { useToast } from "@/shared/ui/Toast";
import { UploadDropzone } from "@/features/upload-photo";
import { EVENT_TYPES } from "@/shared/config/constants";
import type { GalleryPhoto } from "@/entities/gallery-photo/model/types";

export function GalleryManagementPage() {
  const { showToast } = useToast();
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadEventType, setUploadEventType] = useState("");

  const loadPhotos = async () => {
    setLoading(true);
    const res = await fetch("/api/gallery");
    const json = await res.json();
    if (json.success) setPhotos(json.data);
    setLoading(false);
  };

  useEffect(() => {
    void Promise.resolve().then(() => loadPhotos());
  }, []);

  const handleUploaded = async ({
    url,
    publicId,
  }: {
    url: string;
    publicId: string;
  }) => {
    const res = await fetch("/api/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url,
        publicId,
        eventType: uploadEventType || undefined,
      }),
    });
    if (res.ok) {
      loadPhotos();
    } else {
      showToast("Не удалось сохранить фото", "error");
    }
  };

  const handleDelete = async (photo: GalleryPhoto) => {
    if (!confirm("Удалить это фото?")) return;
    setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
    const res = await fetch(`/api/gallery/${photo.id}`, { method: "DELETE" });
    if (res.ok) {
      showToast("Фото удалено", "success");
    } else {
      showToast("Не удалось удалить фото", "error");
      loadPhotos();
    }
  };

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl text-gold">Галерея</h1>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end">
        <Select
          label="Тип события для новых фото"
          value={uploadEventType}
          onChange={(e) => setUploadEventType(e.target.value)}
          options={EVENT_TYPES.map((e) => ({ value: e.enumValue, label: e.enumValue }))}
          placeholder="Без типа"
          className="sm:w-64"
        />
      </div>

      <UploadDropzone
        multiple
        onUploaded={handleUploaded}
        onError={(message) => showToast(message, "error")}
      />

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {photos.map((photo) => (
            <div key={photo.id} className="group relative aspect-square overflow-hidden rounded-lg bg-surface-muted">
              <Image src={photo.url} alt="" fill className="object-cover" />
              <button
                type="button"
                onClick={() => handleDelete(photo)}
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Удалить фото"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
