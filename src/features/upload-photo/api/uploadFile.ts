type UploadResult =
  | { ok: true; url: string; publicId: string }
  | { ok: false; message: string };

export async function uploadFile(file: File): Promise<UploadResult> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/upload", { method: "POST", body: formData });
  const json = await res.json().catch(() => null);

  if (!res.ok || !json?.success) {
    return { ok: false, message: json?.error?.message ?? "Не удалось загрузить файл" };
  }

  return { ok: true, url: json.data.url, publicId: json.data.publicId };
}
