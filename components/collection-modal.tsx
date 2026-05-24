"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";

type CollectionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  productName: string;
};

export function CollectionModal({
  isOpen,
  onClose,
  images,
  productName,
}: CollectionModalProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Reset selected index when modal opens with new images
  useEffect(() => {
    if (isOpen) {
      setSelectedIndex(0);
    }
  }, [isOpen, images]);

  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || images.length === 0) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`Galeri ${productName}`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[rgba(44,36,32,0.7)] backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-md animate-[fadeIn_0.25s_ease-out] rounded-xl bg-[var(--warm-white)] p-4 shadow-2xl sm:p-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -right-2 -top-2 z-20 flex size-8 items-center justify-center rounded-full bg-[var(--charcoal)] text-[0.7rem] text-white shadow-md transition hover:bg-[var(--rose)]"
          aria-label="Tutup"
        >
          ✕
        </button>

        {/* Large Preview */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-[var(--sand-light)]">
          <Image
            src={images[selectedIndex]}
            alt={`${productName} - Foto ${selectedIndex + 1}`}
            fill
            className="object-contain"
            sizes="(max-width: 639px) 85vw, 26rem"
            priority
          />
        </div>

        {/* Thumbnails Row */}
        <div
          className="mt-3 grid gap-2"
          style={{ gridTemplateColumns: `repeat(${images.length}, 1fr)` }}
        >
          {images.map((src, index) => (
            <button
              key={src}
              onClick={() => setSelectedIndex(index)}
              className={`
                relative aspect-square w-full overflow-hidden rounded-md transition
                ${
                  index === selectedIndex
                    ? "ring-2 ring-[var(--rose)] ring-offset-2 ring-offset-white"
                    : "ring-1 ring-[var(--soft-gray)] hover:ring-[var(--rose-light)]"
                }
              `}
            >
              <Image
                src={src}
                alt={`${productName} - Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 639px) 27vw, 8rem"
              />
            </button>
          ))}
        </div>

        {/* Product Name */}
        <p className="mt-3 text-center font-serif-display text-[1rem] text-[var(--charcoal)]">
          {productName}
        </p>
      </div>
    </div>
  );
}
