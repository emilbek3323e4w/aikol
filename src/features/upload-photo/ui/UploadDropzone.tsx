"use client";

import { useRef, useState } from "react";
import { Spinner } from "@/shared/ui/Spinner";
import { uploadFile } from "../api/uploadFile";

interface UploadDropzoneProps {
  multiple?: boolean;
  onUploaded: (result: { url: string; publicId: string }) => void;
  onError?: (message: string) => void;
}

export function UploadDropzone({
  multiple = false,
  onUploaded,
  onError,
}: UploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const result = await uploadFile(file);
      if (result.ok) {
        onUploaded({ url: result.url, publicId: result.publicId });
      } else {
        onError?.(result.message);
      }
    }
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        handleFiles(e.dataTransfer.files);
      }}
      className={`flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
        dragOver ? "border-gold bg-gold/5" : "border-line hover:border-text-muted"
      }`}
    >
      {uploading ? (
        <Spinner />
      ) : (
        <>
          <span className="text-2xl">📷</span>
          <span className="text-sm text-text-muted">
            Перетащите фото сюда или нажмите, чтобы выбрать
          </span>
        </>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
