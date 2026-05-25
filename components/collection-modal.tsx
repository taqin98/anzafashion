"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";

type CollectionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  productName: string;
};

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.5;
const THUMBNAILS_PER_VIEW = 4;

export function CollectionModal({
  isOpen,
  onClose,
  images,
  productName,
}: CollectionModalProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0);

  const previewRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  // Reset zoom and pan when switching images or opening modal
  const resetZoom = useCallback(() => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSelectedIndex(0);
      setThumbnailStartIndex(0);
      resetZoom();
    }
  }, [isOpen, images, resetZoom]);

  useEffect(() => {
    const maxThumbnailStartIndex = Math.max(0, images.length - THUMBNAILS_PER_VIEW);

    setThumbnailStartIndex((currentStartIndex) => {
      if (selectedIndex < currentStartIndex) {
        return selectedIndex;
      }

      if (selectedIndex >= currentStartIndex + THUMBNAILS_PER_VIEW) {
        return Math.min(selectedIndex - THUMBNAILS_PER_VIEW + 1, maxThumbnailStartIndex);
      }

      return Math.min(currentStartIndex, maxThumbnailStartIndex);
    });
  }, [images.length, selectedIndex]);

  // Switch image
  function selectImage(index: number) {
    setSelectedIndex(index);
    resetZoom();
  }

  function showPreviousThumbnails() {
    setThumbnailStartIndex((index) => Math.max(0, index - 1));
  }

  function showNextThumbnails() {
    setThumbnailStartIndex((index) =>
      Math.min(Math.max(0, images.length - THUMBNAILS_PER_VIEW), index + 1),
    );
  }

  // Zoom helpers
  function zoomIn() {
    setZoom((z) => Math.min(MAX_ZOOM, z + ZOOM_STEP));
  }
  function zoomOut() {
    setZoom((z) => {
      const next = Math.max(MIN_ZOOM, z - ZOOM_STEP);
      if (next === MIN_ZOOM) {
        setPanX(0);
        setPanY(0);
      }
      return next;
    });
  }

  // Wheel zoom — zoom toward cursor position
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const rect = previewRef.current?.getBoundingClientRect();
      if (!rect) return;

      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      setZoom((prevZoom) => {
        const direction = e.deltaY < 0 ? 1 : -1;
        const nextZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, prevZoom + direction * ZOOM_STEP));

        if (nextZoom === MIN_ZOOM) {
          setPanX(0);
          setPanY(0);
          return nextZoom;
        }

        // Zoom toward cursor, accounting for center transform-origin
        // Formula: (cursor - center) * (1 - scale) + pan * scale
        const scale = nextZoom / prevZoom;
        setPanX((px) => (mouseX - centerX) * (1 - scale) + px * scale);
        setPanY((py) => (mouseY - centerY) * (1 - scale) + py * scale);

        return nextZoom;
      });
    },
    [],
  );

  // Drag to pan
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (zoom <= 1) return;
      e.preventDefault();
      setDragging(true);
      dragStartRef.current = { x: e.clientX, y: e.clientY, panX, panY };
    },
    [zoom, panX, panY],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!dragging) return;
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      setPanX(dragStartRef.current.panX + dx);
      setPanY(dragStartRef.current.panY + dy);
    },
    [dragging],
  );

  const handleMouseUp = useCallback(() => {
    setDragging(false);
  }, []);

  // Clamp pan so image edges don't go too far out
  const clampPan = useCallback(() => {
    if (zoom <= 1) {
      setPanX(0);
      setPanY(0);
      return;
    }
    const maxPan = (zoom - 1) * 200;
    setPanX((x) => Math.min(maxPan, Math.max(-maxPan, x)));
    setPanY((y) => Math.min(maxPan, Math.max(-maxPan, y)));
  }, [zoom]);

  useEffect(() => {
    clampPan();
  }, [panX, panY, clampPan]);

  // Close on Escape
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

  const visibleThumbnails = images.slice(
    thumbnailStartIndex,
    thumbnailStartIndex + THUMBNAILS_PER_VIEW,
  );
  const canShowPreviousThumbnails = thumbnailStartIndex > 0;
  const canShowNextThumbnails =
    thumbnailStartIndex + THUMBNAILS_PER_VIEW < images.length;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`Galeri ${productName}`}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
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

        {/* Large Preview with Zoom */}
        <div
          ref={previewRef}
          className={`relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-[var(--sand-light)] ${
            zoom > 1 ? "cursor-grab" : "cursor-default"
          } ${dragging ? "cursor-grabbing" : ""}`}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
        >
          <div
            className="absolute inset-0"
            style={{
              transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
              transformOrigin: "center center",
              transition: dragging ? "none" : "transform 0.15s ease-out",
            }}
          >
            <Image
              src={images[selectedIndex]}
              alt={`${productName} - Foto ${selectedIndex + 1}`}
              fill
              className="object-contain pointer-events-none"
              sizes="(max-width: 639px) 85vw, 26rem"
              priority
              draggable={false}
            />
          </div>

          {/* Zoom Controls */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-lg bg-[rgba(44,36,32,0.65)] px-2 py-1 backdrop-blur-sm">
            <button
              onClick={(e) => { e.stopPropagation(); zoomOut(); }}
              disabled={zoom <= MIN_ZOOM}
              className="flex size-7 items-center justify-center rounded text-[1rem] leading-none text-white transition hover:bg-white/20 disabled:opacity-30"
              aria-label="Zoom out"
            >
              −
            </button>
            <span className="min-w-[3rem] text-center text-[0.7rem] tabular-nums text-white">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); zoomIn(); }}
              disabled={zoom >= MAX_ZOOM}
              className="flex size-7 items-center justify-center rounded text-[1rem] leading-none text-white transition hover:bg-white/20 disabled:opacity-30"
              aria-label="Zoom in"
            >
              +
            </button>
          </div>
        </div>

        {/* Thumbnails Row */}
        <div className="mt-3 flex items-center gap-2">
          {images.length > THUMBNAILS_PER_VIEW ? (
            <button
              type="button"
              onClick={showPreviousThumbnails}
              disabled={!canShowPreviousThumbnails}
              className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[var(--soft-gray)] text-[var(--charcoal)] transition hover:border-[var(--rose)] hover:text-[var(--rose)] disabled:cursor-not-allowed disabled:opacity-35"
              aria-label="Thumbnail sebelumnya"
            >
              &larr;
            </button>
          ) : null}

          <div
            className="grid flex-1 gap-2"
            style={{ gridTemplateColumns: `repeat(${visibleThumbnails.length}, minmax(0, 1fr))` }}
          >
            {visibleThumbnails.map((src, offset) => {
              const index = thumbnailStartIndex + offset;

              return (
                <button
                  key={`${src}-${index}`}
                  type="button"
                  onClick={() => selectImage(index)}
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
                    sizes="(max-width: 639px) 18vw, 6rem"
                  />
                </button>
              );
            })}
          </div>

          {images.length > THUMBNAILS_PER_VIEW ? (
            <button
              type="button"
              onClick={showNextThumbnails}
              disabled={!canShowNextThumbnails}
              className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[var(--soft-gray)] text-[var(--charcoal)] transition hover:border-[var(--rose)] hover:text-[var(--rose)] disabled:cursor-not-allowed disabled:opacity-35"
              aria-label="Thumbnail berikutnya"
            >
              &rarr;
            </button>
          ) : null}
        </div>

        {/* Product Name */}
        <p className="mt-3 text-center font-serif-display text-[1rem] text-[var(--charcoal)]">
          {productName}
        </p>
      </div>
    </div>
  );
}
