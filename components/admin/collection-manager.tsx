"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { AdminTopbar } from "@/components/admin/admin-topbar";
import type {
  AdminCollectionListResponse,
  AdminCollectionMutationResponse,
  CollectionMutationPayload,
  CollectionRecord,
} from "@/lib/collection-api";
import type { CollectionIcon } from "@/lib/site-content";

const iconOptions: Array<{ value: CollectionIcon; label: string }> = [
  { value: "kebaya", label: "Kebaya" },
  { value: "dress", label: "Dress" },
  { value: "blouse", label: "Atasan / Blouse" },
  { value: "gamis", label: "Gamis" },
];

type CollectionFormState = {
  id?: string;
  name: string;
  category: string;
  price: string;
  label: string;
  icon: CollectionIcon;
  image: string;
  galleryImages: string[];
  badge: string;
  badgeTone: "" | "rose" | "terracotta";
  sortOrder: string;
  isActive: boolean;
};

type FeedbackState =
  | {
      tone: "success" | "error";
      message: string;
    }
  | null;

function classNames(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function createEmptyFormState(nextSortOrder: number): CollectionFormState {
  return {
    name: "",
    category: "",
    price: "",
    label: "",
    icon: "kebaya",
    image: "",
    galleryImages: [],
    badge: "",
    badgeTone: "",
    sortOrder: String(nextSortOrder),
    isActive: true,
  };
}

function mapRecordToFormState(record: CollectionRecord): CollectionFormState {
  const coverImage = record.image || record.images[0] || "";
  const galleryImages = record.images.filter((image, index) => {
    return image && (image !== coverImage || index !== 0);
  });

  return {
    id: record.id,
    name: record.name,
    category: record.category,
    price: record.price,
    label: record.label,
    icon: record.icon,
    image: coverImage,
    galleryImages,
    badge: record.badge || "",
    badgeTone: record.badgeTone || "",
    sortOrder: String(record.sortOrder),
    isActive: record.isActive,
  };
}

function buildMutationPayload(formState: CollectionFormState): CollectionMutationPayload {
  const coverImage = formState.image.trim();
  const galleryImages = formState.galleryImages.map((item) => item.trim()).filter(Boolean);
  const images = Array.from(new Set([coverImage, ...galleryImages].filter(Boolean)));
  const name = formState.name.trim();

  return {
    id: formState.id,
    name,
    category: formState.category.trim(),
    price: formState.price.trim(),
    label: formState.label.trim() || `Foto ${name || "Produk"}`,
    icon: formState.icon,
    image: coverImage,
    images,
    badge: formState.badge.trim(),
    badgeTone: formState.badgeTone || undefined,
    sortOrder: Math.max(1, Number(formState.sortOrder) || 1),
    isActive: formState.isActive,
  };
}

function getPreviewImages(formState: CollectionFormState) {
  return [formState.image, ...formState.galleryImages].map((item) => item.trim()).filter(Boolean);
}

function buildUpdatePayload(
  record: CollectionRecord,
  overrides: Partial<CollectionMutationPayload>,
): CollectionMutationPayload {
  return {
    id: record.id,
    name: overrides.name ?? record.name,
    category: overrides.category ?? record.category,
    price: overrides.price ?? record.price,
    label: overrides.label ?? record.label,
    icon: overrides.icon ?? record.icon,
    image: overrides.image ?? record.image ?? record.images[0] ?? "",
    images: overrides.images ?? record.images,
    badge: overrides.badge ?? record.badge ?? "",
    badgeTone: overrides.badgeTone ?? record.badgeTone,
    sortOrder: overrides.sortOrder ?? record.sortOrder,
    isActive: overrides.isActive ?? record.isActive,
  };
}

export function CollectionManager({ initialItems }: { initialItems: CollectionRecord[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "draft">("all");
  const [formState, setFormState] = useState<CollectionFormState>(
    createEmptyFormState(initialItems.length + 1),
  );

  const filteredItems = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return items.filter((item) => {
      const matchesQuery =
        !normalizedQuery ||
        item.name.toLowerCase().includes(normalizedQuery) ||
        item.category.toLowerCase().includes(normalizedQuery) ||
        item.id.toLowerCase().includes(normalizedQuery);
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && item.isActive) ||
        (statusFilter === "draft" && !item.isActive);

      return matchesQuery && matchesStatus;
    });
  }, [items, searchQuery, statusFilter]);

  function resetForm(nextSortOrder = items.length + 1) {
    setFormState(createEmptyFormState(nextSortOrder));
    setIsAdvancedOpen(false);
  }

  function closeForm() {
    setIsFormOpen(false);
    resetForm();
  }

  function openCreateForm() {
    resetForm(items.length + 1);
    setFeedback(null);
    setIsFormOpen(true);
  }

  function openEditForm(record: CollectionRecord) {
    setFormState(mapRecordToFormState(record));
    setFeedback(null);
    setIsAdvancedOpen(false);
    setIsFormOpen(true);
  }

  function upsertRecord(nextRecord: CollectionRecord) {
    setItems((currentItems) =>
      currentItems
        .some((item) => item.id === nextRecord.id)
        ? currentItems
            .map((item) => (item.id === nextRecord.id ? nextRecord : item))
            .sort((left, right) => left.sortOrder - right.sortOrder)
        : [...currentItems, nextRecord].sort((left, right) => left.sortOrder - right.sortOrder),
    );
  }

  function setGalleryImage(index: number, value: string) {
    setFormState((currentState) => ({
      ...currentState,
      galleryImages: currentState.galleryImages.map((item, itemIndex) =>
        itemIndex === index ? value : item,
      ),
    }));
  }

  function addGalleryImage() {
    setFormState((currentState) => ({
      ...currentState,
      galleryImages: [...currentState.galleryImages, ""],
    }));
  }

  function removeGalleryImage(index: number) {
    setFormState((currentState) => ({
      ...currentState,
      galleryImages: currentState.galleryImages.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  async function refreshCollections() {
    setFeedback(null);
    setIsRefreshing(true);

    try {
      const response = await fetch("/api/admin/collections", {
        cache: "no-store",
      });
      const result = (await response.json()) as AdminCollectionListResponse;

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "Gagal memuat data koleksi.");
      }

      setItems(result.data);
      setFeedback({
        tone: "success",
        message: "Data koleksi berhasil dimuat ulang.",
      });
      router.refresh();
    } catch (refreshError) {
      setFeedback({
        tone: "error",
        message:
          refreshError instanceof Error
            ? refreshError.message
            : "Gagal memuat data koleksi.",
      });
    } finally {
      setIsRefreshing(false);
    }
  }

  async function saveCollection(
    payload: CollectionMutationPayload,
    options: {
      endpoint: string;
      method: "POST" | "PATCH";
      successMessage: string;
      closeAfterSave?: boolean;
    },
  ) {
    const response = await fetch(options.endpoint, {
      method: options.method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = (await response.json()) as AdminCollectionMutationResponse;

    if (!response.ok || !result.ok || !result.data) {
      throw new Error(result.message || "Gagal menyimpan koleksi.");
    }

    upsertRecord(result.data);
    setFeedback({
      tone: "success",
      message: options.successMessage,
    });

    if (options.closeAfterSave) {
      closeForm();
    }

    router.refresh();
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);
    setIsSubmitting(true);

    try {
      const payload = buildMutationPayload(formState);
      const isEditing = Boolean(formState.id);

      await saveCollection(payload, {
        endpoint: isEditing ? `/api/admin/collections/${formState.id}` : "/api/admin/collections",
        method: isEditing ? "PATCH" : "POST",
        successMessage: isEditing
          ? "Perubahan koleksi berhasil disimpan."
          : "Koleksi baru berhasil ditambahkan.",
        closeAfterSave: true,
      });
    } catch (submitError) {
      setFeedback({
        tone: "error",
        message:
          submitError instanceof Error ? submitError.message : "Gagal menyimpan koleksi.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleVisibilityToggle(record: CollectionRecord) {
    setFeedback(null);

    try {
      await saveCollection(buildUpdatePayload(record, { isActive: !record.isActive }), {
        endpoint: `/api/admin/collections/${record.id}`,
        method: "PATCH",
        successMessage: record.isActive
          ? `"${record.name}" berhasil disembunyikan dari website.`
          : `"${record.name}" berhasil ditampilkan di website.`,
      });
    } catch (toggleError) {
      setFeedback({
        tone: "error",
        message:
          toggleError instanceof Error
            ? toggleError.message
            : "Gagal mengubah status koleksi.",
      });
    }
  }

  async function handleDelete(record: CollectionRecord) {
    const typedName = window.prompt(
      `Ketik nama koleksi berikut untuk menghapus permanen:\n${record.name}`,
    );

    if (typedName === null) {
      return;
    }

    if (typedName.trim() !== record.name.trim()) {
      setFeedback({
        tone: "error",
        message: "Nama koleksi tidak cocok. Hapus permanen dibatalkan.",
      });
      return;
    }

    setFeedback(null);

    try {
      const response = await fetch(`/api/admin/collections/${record.id}`, {
        method: "DELETE",
      });
      const result = (await response.json()) as AdminCollectionMutationResponse;

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "Gagal menghapus koleksi.");
      }

      setItems((currentItems) => currentItems.filter((item) => item.id !== record.id));
      setFeedback({
        tone: "success",
        message: `"${record.name}" berhasil dihapus permanen.`,
      });
      router.refresh();
    } catch (deleteError) {
      setFeedback({
        tone: "error",
        message:
          deleteError instanceof Error ? deleteError.message : "Gagal menghapus koleksi.",
      });
    }
  }

  const previewImages = getPreviewImages(formState);

  return (
    <>
      <AdminTopbar
        title="Koleksi"
        subtitle="Kelola produk yang tampil di website dengan langkah yang lebih sederhana"
        actionLabel="Tambah Koleksi"
        onActionClick={openCreateForm}
      />

      <div className="space-y-5 px-4 pb-24 pt-4 lg:px-7 lg:pb-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
          <div className="w-full min-w-0 flex-1 lg:min-w-[260px]">
            <div className="flex items-center gap-2 rounded-[12px] border border-[rgba(44,36,32,0.08)] bg-[#fdf8f0] px-3 py-2.5">
              <svg viewBox="0 0 24 24" className="size-4 shrink-0 fill-none stroke-[#7a6b63] [stroke-width:1.8]">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Cari nama koleksi atau kategori..."
                className="w-full border-none bg-transparent font-sans text-[0.84rem] text-[#2c2420] outline-none placeholder:text-[#9a8a70]"
              />
            </div>
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}
            className="w-full rounded-[12px] border border-[rgba(44,36,32,0.12)] bg-[#fdf8f0] px-3 py-2.5 font-sans text-[0.8rem] text-[#2c2420] outline-none sm:w-auto"
          >
            <option value="all">Semua Tampilan</option>
            <option value="active">Sedang Tampil</option>
            <option value="draft">Disembunyikan</option>
          </select>

          <button
            type="button"
            onClick={refreshCollections}
            disabled={isRefreshing}
            className="w-full rounded-[12px] border border-[rgba(44,36,32,0.12)] bg-[#fdf8f0] px-4 py-2.5 font-sans text-[0.8rem] text-[#7a6b63] transition hover:bg-[#f5ede2] disabled:opacity-60 sm:w-auto"
          >
            {isRefreshing ? "Memuat..." : "Muat Ulang Data"}
          </button>

          <button
            type="button"
            onClick={openCreateForm}
            className="w-full rounded-[12px] bg-[#b8860b] px-4 py-2.5 font-sans text-[0.8rem] font-medium text-white transition hover:bg-[#a07808] lg:hidden sm:w-auto"
          >
            Tambah Koleksi
          </button>
        </div>

        {feedback ? (
          <div
            className={classNames(
              "rounded-[14px] px-4 py-3 font-sans text-[0.82rem]",
              feedback.tone === "success"
                ? "border border-[#bad2a7] bg-[#edf6e5] text-[#3b6d11]"
                : "border border-[#d7b186] bg-[#fff2df] text-[#8b5347]",
            )}
          >
            {feedback.message}
          </div>
        ) : null}

        <div className="overflow-hidden rounded-[18px] border border-[rgba(44,36,32,0.08)] bg-[#fdf8f0]">
          <div className="flex items-center justify-between gap-3 border-b border-[rgba(44,36,32,0.08)] px-5 py-4">
            <div>
              <div className="font-sans text-[0.72rem] uppercase tracking-[0.18em] text-[#7a6b63]">
                Daftar Koleksi
              </div>
              <div className="mt-1 font-sans text-[0.82rem] text-[#9a8a70]">
                {filteredItems.length} dari {items.length} koleksi
              </div>
            </div>
          </div>

          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full border-collapse font-sans text-[0.84rem]">
              <thead>
                <tr className="bg-[#fbf5eb] text-left text-[0.64rem] uppercase tracking-[0.14em] text-[#7a6b63]">
                  <th className="px-4 py-3 font-medium">Koleksi</th>
                  <th className="px-4 py-3 font-medium">Kategori</th>
                  <th className="px-4 py-3 font-medium">Status Tayang</th>
                  <th className="px-4 py-3 font-medium">Urutan</th>
                  <th className="px-4 py-3 font-medium">Jumlah Foto</th>
                  <th className="px-4 py-3 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-[rgba(44,36,32,0.06)] align-top text-[#2c2420]"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-start gap-3">
                        <div className="relative size-16 shrink-0 overflow-hidden rounded-[12px] bg-[#efe5d7]">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                              sizes="4rem"
                            />
                          ) : null}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium">{item.name}</div>
                          <div className="mt-1 text-[0.74rem] text-[#7a6b63]">{item.category}</div>
                          {item.price ? (
                            <div className="mt-1 text-[0.76rem] text-[#b8860b]">{item.price}</div>
                          ) : null}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-[#7a6b63]">{item.category}</td>
                    <td className="px-4 py-4">
                      <span
                        className={classNames(
                          "inline-flex rounded-full px-2.5 py-1 text-[0.68rem] uppercase tracking-[0.12em]",
                          item.isActive
                            ? "bg-[#eaf3de] text-[#3b6d11]"
                            : "bg-[#eeedfe] text-[#534ab7]",
                        )}
                      >
                        {item.isActive ? "Tampil" : "Disembunyikan"}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-serif-display text-[1rem]">{item.sortOrder}</td>
                    <td className="px-4 py-4 text-[#7a6b63]">{item.images.length}</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => openEditForm(item)}
                          className="rounded-[10px] border border-[rgba(44,36,32,0.12)] px-3 py-2 text-[0.78rem] text-[#7a6b63] transition hover:bg-[#f5ede2]"
                        >
                          Ubah
                        </button>
                        <button
                          type="button"
                          onClick={() => handleVisibilityToggle(item)}
                          className="rounded-[10px] border border-[rgba(184,134,11,0.2)] px-3 py-2 text-[0.78rem] text-[#b8860b] transition hover:bg-[#fbf0d0]"
                        >
                          {item.isActive ? "Sembunyikan" : "Tampilkan"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          className="rounded-[10px] border border-[rgba(216,90,48,0.2)] px-3 py-2 text-[0.78rem] text-[#d85a30] transition hover:bg-[#faece7]"
                        >
                          Hapus Permanen
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 p-3 lg:hidden">
            {filteredItems.map((item) => (
              <article
                key={item.id}
                className="overflow-hidden rounded-[16px] border border-[rgba(44,36,32,0.08)] bg-white"
              >
                <div className="relative aspect-[4/3] bg-[#efe5d7]">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="92vw"
                    />
                  ) : null}
                  <div className="absolute left-3 top-3 rounded-full bg-[rgba(28,22,16,0.84)] px-3 py-1 text-[0.66rem] uppercase tracking-[0.16em] text-white">
                    {item.isActive ? "Tampil" : "Disembunyikan"}
                  </div>
                </div>

                <div className="space-y-4 p-4">
                  <div>
                    <h3 className="text-balance font-serif-display text-[1.2rem]">{item.name}</h3>
                    <p className="mt-1 font-sans text-[0.8rem] text-[#7a6b63]">{item.category}</p>
                    {item.price ? (
                      <p className="mt-1 font-sans text-[0.76rem] text-[#b8860b]">{item.price}</p>
                    ) : null}
                  </div>

                  <div className="grid grid-cols-1 gap-2 font-sans text-[0.76rem] text-[#7a6b63] sm:grid-cols-2">
                    <div className="rounded-[12px] bg-[#fbf5eb] px-3 py-2">Urutan: {item.sortOrder}</div>
                    <div className="rounded-[12px] bg-[#fbf5eb] px-3 py-2">Jumlah Foto: {item.images.length}</div>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    <button
                      type="button"
                      onClick={() => openEditForm(item)}
                      className="rounded-[12px] border border-[rgba(44,36,32,0.12)] px-4 py-3 font-sans text-[0.8rem] text-[#7a6b63]"
                    >
                      Ubah Data Koleksi
                    </button>
                    <button
                      type="button"
                      onClick={() => handleVisibilityToggle(item)}
                      className="rounded-[12px] border border-[rgba(184,134,11,0.2)] px-4 py-3 font-sans text-[0.8rem] text-[#b8860b]"
                    >
                      {item.isActive ? "Sembunyikan dari Website" : "Tampilkan di Website"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      className="rounded-[12px] border border-[rgba(216,90,48,0.2)] px-4 py-3 font-sans text-[0.8rem] text-[#d85a30]"
                    >
                      Hapus Permanen
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="rounded-[18px] border border-dashed border-[rgba(44,36,32,0.14)] bg-[#fdf8f0] px-5 py-8 text-center font-sans text-[0.88rem] text-[#7a6b63]">
            Belum ada koleksi yang cocok dengan pencarian atau filter saat ini.
          </div>
        ) : null}
      </div>

      {isFormOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-[rgba(28,22,16,0.52)] p-0 lg:p-6">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-[24px] border border-[rgba(44,36,32,0.08)] bg-[#fdf8f0] pb-[env(safe-area-inset-bottom)] shadow-[0_-18px_48px_rgba(44,36,32,0.18)] lg:rounded-[24px]">
            <div className="sticky top-0 z-10 border-b border-[rgba(44,36,32,0.08)] bg-[rgba(253,248,240,0.96)] px-4 py-4 backdrop-blur lg:px-6">
              <div className="mb-3 flex justify-center lg:hidden">
                <div className="h-1.5 w-14 rounded-full bg-[#d9cdbb]" />
              </div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-sans text-[0.68rem] uppercase tracking-[0.22em] text-[#b8860b]">
                    {formState.id ? "Ubah Produk" : "Tambah Produk"}
                  </div>
                  <h3 className="mt-1 font-serif-display text-[1.65rem] font-light text-[#2c2420]">
                    {formState.id ? "Edit Koleksi" : "Koleksi Baru"}
                  </h3>
                  <p className="mt-2 max-w-lg font-sans text-[0.82rem] leading-6 text-[#7a6b63]">
                    Isi data utama terlebih dahulu. Pengaturan teknis disimpan di bagian lanjutan.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-[10px] border border-[rgba(44,36,32,0.12)] px-3 py-2 font-sans text-[0.74rem] uppercase tracking-[0.12em] text-[#7a6b63]"
                >
                  Tutup
                </button>
              </div>
            </div>

            <form className="space-y-5 px-4 py-5 lg:px-6 lg:py-6" onSubmit={handleSubmit}>
              {feedback?.tone === "error" ? (
                <div className="rounded-[14px] border border-[#d7b186] bg-[#fff2df] px-4 py-3 font-sans text-[0.82rem] text-[#8b5347]">
                  {feedback.message}
                </div>
              ) : null}

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="font-sans text-[0.68rem] uppercase tracking-[0.2em] text-[#7a6b63]">
                    Nama Koleksi
                  </label>
                  <input
                    required
                    value={formState.name}
                    onChange={(event) =>
                      setFormState((currentState) => ({
                        ...currentState,
                        name: event.target.value,
                      }))
                    }
                    placeholder="Contoh: Kebaya Wisuda Satin"
                    className="w-full rounded-[14px] border border-[#d9cdbb] bg-white px-4 py-3 font-sans text-[0.9rem] outline-none transition focus:border-[#b8860b]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-sans text-[0.68rem] uppercase tracking-[0.2em] text-[#7a6b63]">
                    Kategori
                  </label>
                  <input
                    required
                    value={formState.category}
                    onChange={(event) =>
                      setFormState((currentState) => ({
                        ...currentState,
                        category: event.target.value,
                      }))
                    }
                    placeholder="Contoh: Kebaya · Formal"
                    className="w-full rounded-[14px] border border-[#d9cdbb] bg-white px-4 py-3 font-sans text-[0.9rem] outline-none transition focus:border-[#b8860b]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-sans text-[0.68rem] uppercase tracking-[0.2em] text-[#7a6b63]">
                  Harga
                </label>
                <input
                  value={formState.price}
                  onChange={(event) =>
                    setFormState((currentState) => ({
                      ...currentState,
                      price: event.target.value,
                    }))
                  }
                  placeholder="Contoh: Rp850.000"
                  className="w-full rounded-[14px] border border-[#d9cdbb] bg-white px-4 py-3 font-sans text-[0.9rem] outline-none transition focus:border-[#b8860b]"
                />
              </div>

              <div className="space-y-2">
                <label className="font-sans text-[0.68rem] uppercase tracking-[0.2em] text-[#7a6b63]">
                  Foto Cover
                </label>
                <input
                  required
                  value={formState.image}
                  onChange={(event) =>
                    setFormState((currentState) => ({
                      ...currentState,
                      image: event.target.value,
                    }))
                  }
                  placeholder="Tempel URL foto cover utama"
                  className="w-full rounded-[14px] border border-[#d9cdbb] bg-white px-4 py-3 font-sans text-[0.9rem] outline-none transition focus:border-[#b8860b]"
                />
                <p className="font-sans text-[0.76rem] text-[#9a8a70]">
                  Foto ini akan tampil sebagai gambar utama di website.
                </p>
              </div>

              <div className="space-y-3 rounded-[18px] border border-[#eadfce] bg-[#fffaf2] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-sans text-[0.72rem] uppercase tracking-[0.18em] text-[#7a6b63]">
                      Foto Tambahan
                    </div>
                    <div className="mt-1 font-sans text-[0.8rem] text-[#9a8a70]">
                      Tambahkan foto detail lain bila ada. Bagian ini opsional.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={addGalleryImage}
                    className="shrink-0 rounded-[12px] border border-[rgba(44,36,32,0.12)] px-3 py-2 font-sans text-[0.76rem] text-[#7a6b63] transition hover:bg-[#f3ece2]"
                  >
                    + Tambah Foto
                  </button>
                </div>

                {formState.galleryImages.length === 0 ? (
                  <div className="rounded-[14px] border border-dashed border-[#d9cdbb] bg-white px-4 py-4 font-sans text-[0.82rem] text-[#9a8a70]">
                    Belum ada foto tambahan. Anda bisa lanjut tanpa foto tambahan.
                  </div>
                ) : null}

                <div className="space-y-3">
                  {formState.galleryImages.map((image, index) => (
                    <div key={`${index}-${formState.id || "new"}`} className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          value={image}
                          onChange={(event) => setGalleryImage(index, event.target.value)}
                          placeholder={`URL foto tambahan ${index + 1}`}
                          className="w-full rounded-[14px] border border-[#d9cdbb] bg-white px-4 py-3 font-sans text-[0.9rem] outline-none transition focus:border-[#b8860b]"
                        />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(index)}
                          className="shrink-0 rounded-[12px] border border-[rgba(216,90,48,0.2)] px-3 py-2 font-sans text-[0.76rem] text-[#d85a30] transition hover:bg-[#faece7]"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {previewImages.length > 0 ? (
                <div className="space-y-3 rounded-[18px] border border-[#eadfce] bg-white p-4">
                  <div className="font-sans text-[0.72rem] uppercase tracking-[0.18em] text-[#7a6b63]">
                    Preview Foto
                  </div>
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                    {previewImages.map((image, index) => (
                      <div
                        key={`${image}-${index}`}
                        className="overflow-hidden rounded-[14px] border border-[#eadfce] bg-[#fbf5eb]"
                      >
                        <img
                          src={image}
                          alt={`Preview koleksi ${index + 1}`}
                          className="aspect-square w-full object-cover"
                        />
                        <div className="px-2 py-2 font-sans text-[0.68rem] text-[#7a6b63]">
                          {index === 0 ? "Cover" : `Foto ${index}`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <label className="flex items-center gap-3 rounded-[16px] border border-[#d9cdbb] bg-white px-4 py-4 font-sans text-[0.88rem] text-[#2c2420]">
                <input
                  type="checkbox"
                  checked={formState.isActive}
                  onChange={(event) =>
                    setFormState((currentState) => ({
                      ...currentState,
                      isActive: event.target.checked,
                    }))
                  }
                  className="size-4 accent-[#b8860b]"
                />
                <div>
                  <div className="font-medium">Tampilkan di Website</div>
                  <div className="mt-1 text-[0.76rem] text-[#7a6b63]">
                    Jika dimatikan, koleksi tetap tersimpan tetapi tidak muncul di landing page.
                  </div>
                </div>
              </label>

              <div className="rounded-[18px] border border-[#eadfce] bg-[#fffaf2]">
                <button
                  type="button"
                  onClick={() => setIsAdvancedOpen((currentState) => !currentState)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
                >
                  <div>
                    <div className="font-sans text-[0.72rem] uppercase tracking-[0.18em] text-[#7a6b63]">
                      Pengaturan Lanjutan
                    </div>
                    <div className="mt-1 font-sans text-[0.8rem] text-[#9a8a70]">
                      Buka hanya jika ingin mengatur urutan, badge, atau jenis ikon.
                    </div>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 font-sans text-[0.74rem] text-[#7a6b63]">
                    {isAdvancedOpen ? "Tutup" : "Buka"}
                  </span>
                </button>

                {isAdvancedOpen ? (
                  <div className="grid gap-4 border-t border-[#eadfce] px-4 py-4 md:grid-cols-2">
                    {formState.id ? (
                      <div className="space-y-2 md:col-span-2">
                        <label className="font-sans text-[0.68rem] uppercase tracking-[0.2em] text-[#7a6b63]">
                          ID Koleksi
                        </label>
                        <input
                          value={formState.id}
                          disabled
                          className="w-full rounded-[14px] border border-[#e2d6c4] bg-[#f7f1e8] px-4 py-3 font-sans text-[0.86rem] text-[#7a6b63] outline-none"
                        />
                      </div>
                    ) : null}

                    <div className="space-y-2">
                      <label className="font-sans text-[0.68rem] uppercase tracking-[0.2em] text-[#7a6b63]">
                        Jenis Produk
                      </label>
                      <select
                        value={formState.icon}
                        onChange={(event) =>
                          setFormState((currentState) => ({
                            ...currentState,
                            icon: event.target.value as CollectionIcon,
                          }))
                        }
                        className="w-full rounded-[14px] border border-[#d9cdbb] bg-white px-4 py-3 font-sans text-[0.9rem] outline-none transition focus:border-[#b8860b]"
                      >
                        {iconOptions.map((icon) => (
                          <option key={icon.value} value={icon.value}>
                            {icon.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="font-sans text-[0.68rem] uppercase tracking-[0.2em] text-[#7a6b63]">
                        Urutan Tampil
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={formState.sortOrder}
                        onChange={(event) =>
                          setFormState((currentState) => ({
                            ...currentState,
                            sortOrder: event.target.value,
                          }))
                        }
                        className="w-full rounded-[14px] border border-[#d9cdbb] bg-white px-4 py-3 font-sans text-[0.9rem] outline-none transition focus:border-[#b8860b]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="font-sans text-[0.68rem] uppercase tracking-[0.2em] text-[#7a6b63]">
                        Label Gambar
                      </label>
                      <input
                        value={formState.label}
                        onChange={(event) =>
                          setFormState((currentState) => ({
                            ...currentState,
                            label: event.target.value,
                          }))
                        }
                        placeholder="Kosongkan jika tidak diperlukan"
                        className="w-full rounded-[14px] border border-[#d9cdbb] bg-white px-4 py-3 font-sans text-[0.9rem] outline-none transition focus:border-[#b8860b]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="font-sans text-[0.68rem] uppercase tracking-[0.2em] text-[#7a6b63]">
                        Teks Badge
                      </label>
                      <input
                        value={formState.badge}
                        onChange={(event) =>
                          setFormState((currentState) => ({
                            ...currentState,
                            badge: event.target.value,
                          }))
                        }
                        placeholder="Contoh: Favorit"
                        className="w-full rounded-[14px] border border-[#d9cdbb] bg-white px-4 py-3 font-sans text-[0.9rem] outline-none transition focus:border-[#b8860b]"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="font-sans text-[0.68rem] uppercase tracking-[0.2em] text-[#7a6b63]">
                        Warna Badge
                      </label>
                      <select
                        value={formState.badgeTone}
                        onChange={(event) =>
                          setFormState((currentState) => ({
                            ...currentState,
                            badgeTone: event.target.value as CollectionFormState["badgeTone"],
                          }))
                        }
                        className="w-full rounded-[14px] border border-[#d9cdbb] bg-white px-4 py-3 font-sans text-[0.9rem] outline-none transition focus:border-[#b8860b]"
                      >
                        <option value="">Tanpa Warna Badge</option>
                        <option value="rose">Rose</option>
                        <option value="terracotta">Terracotta</option>
                      </select>
                    </div>
                  </div>
                ) : null}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center rounded-[14px] bg-[#b8860b] px-5 py-3.5 font-sans text-[0.85rem] font-medium uppercase tracking-[0.12em] text-white transition hover:bg-[#a07808] disabled:cursor-wait disabled:opacity-70"
              >
                {isSubmitting
                  ? "Menyimpan..."
                  : formState.id
                    ? "Simpan Perubahan"
                    : "Simpan Koleksi Baru"}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
