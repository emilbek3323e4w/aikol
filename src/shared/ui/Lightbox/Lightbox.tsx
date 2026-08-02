"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";

interface LightboxProps {
  images: { url: string; alt?: string }[];
  index: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

export function Lightbox({ images, index, onClose, onIndexChange }: LightboxProps) {
  const touchStartX = useRef<number | null>(null);

  const goPrev = () => onIndexChange((index - 1 + images.length) % images.length);
  const goNext = () => onIndexChange((index + 1) % images.length);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  if (typeof document === "undefined") return null;

  const current = images[index];
  if (!current) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95"
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const delta = e.changedTouches[0].clientX - touchStartX.current;
        if (delta > 50) goPrev();
        if (delta < -50) goNext();
        touchStartX.current = null;
      }}
    >
      <button
        type="button"
        aria-label="Закрыть"
        onClick={onClose}
        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center text-2xl text-white/80 hover:text-white"
      >
        ✕
      </button>

      {images.length > 1 && (
        <button
          type="button"
          aria-label="Предыдущее фото"
          onClick={goPrev}
          className="absolute left-2 flex h-11 w-11 items-center justify-center text-3xl text-white/80 hover:text-white sm:left-6"
        >
          ←
        </button>
      )}

      <div className="relative h-[80vh] w-[90vw] max-w-4xl">
        <Image
          src={current.url}
          alt={current.alt ?? ""}
          fill
          className="object-contain"
          sizes="90vw"
        />
      </div>

      {images.length > 1 && (
        <button
          type="button"
          aria-label="Следующее фото"
          onClick={goNext}
          className="absolute right-2 flex h-11 w-11 items-center justify-center text-3xl text-white/80 hover:text-white sm:right-6"
        >
          →
        </button>
      )}
    </div>,
    document.body,
  );
}
