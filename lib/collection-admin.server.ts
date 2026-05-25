import "server-only";

import {
  randomUUID,
} from "node:crypto";

import type {
  AdminCollectionListResponse,
  AdminCollectionMutationResponse,
  CollectionCrudAction,
  CollectionMutationPayload,
  CollectionRecord,
} from "@/lib/collection-api";
import {
  collectionItems as fallbackCollectionItems,
  type CollectionIcon,
  type CollectionItem,
} from "@/lib/site-content";

type RawCollectionRecord = Record<string, unknown>;

const allowedIcons: CollectionIcon[] = ["kebaya", "dress", "blouse", "gamis"];
const allowedBadgeTones = ["rose", "terracotta"] as const;

function readString(record: RawCollectionRecord, keys: string[]) {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
}

function parseImages(value: unknown) {
  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (typeof value !== "string") {
    return [];
  }

  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return [];
  }

  if (trimmedValue.startsWith("[")) {
    try {
      return parseImages(JSON.parse(trimmedValue));
    } catch {
      return [];
    }
  }

  return trimmedValue
    .split(/[\n,|]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseBoolean(value: unknown, fallback = true) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return value !== 0;
  }

  if (typeof value !== "string") {
    return fallback;
  }

  const normalizedValue = value.trim().toLowerCase();

  if (["true", "1", "yes", "active"].includes(normalizedValue)) {
    return true;
  }

  if (["false", "0", "no", "inactive"].includes(normalizedValue)) {
    return false;
  }

  return fallback;
}

function normalizeIcon(value: string): CollectionIcon {
  const normalizedValue = value.trim().toLowerCase();

  return allowedIcons.includes(normalizedValue as CollectionIcon)
    ? (normalizedValue as CollectionIcon)
    : "blouse";
}

function normalizeBadgeTone(value: string): CollectionItem["badgeTone"] {
  const normalizedValue = value.trim().toLowerCase();

  return allowedBadgeTones.includes(normalizedValue as (typeof allowedBadgeTones)[number])
    ? (normalizedValue as (typeof allowedBadgeTones)[number])
    : undefined;
}

function normalizeCollectionRecord(record: RawCollectionRecord, index: number): CollectionRecord | null {
  const name = readString(record, ["name", "title", "product_name"]);

  if (!name) {
    return null;
  }

  const id = readString(record, ["id"]) || `collection-${index + 1}`;
  const category = readString(record, ["category", "type"]);
  const price = readString(record, ["price"]);
  const label = readString(record, ["label", "image_label"]) || `Foto Produk ${index + 1}`;
  const icon = normalizeIcon(readString(record, ["icon"]));
  const image = readString(record, ["image", "thumbnail", "cover"]);
  const images = parseImages(record.images ?? record.gallery ?? record.photos);
  const badge = readString(record, ["badge"]);
  const badgeTone = normalizeBadgeTone(readString(record, ["badge_tone", "badgeTone"]));
  const sortOrderValue = Number(readString(record, ["sort_order", "sortOrder", "order"]));
  const isActive = parseBoolean(record.is_active ?? record.isActive ?? record.active, true);

  return {
    id,
    name,
    category,
    price,
    label,
    icon,
    image: image || images[0],
    images: images.length > 0 ? images : image ? [image] : [],
    badge: badge || undefined,
    badgeTone,
    isActive,
    sortOrder: Number.isFinite(sortOrderValue) ? sortOrderValue : index + 1,
  };
}

function mapFallbackCollectionItems() {
  return fallbackCollectionItems.map((item, index) => ({
    ...item,
    image: item.image || item.images?.[0],
    images: item.images || (item.image ? [item.image] : []),
    isActive: true,
    sortOrder: index + 1,
  }));
}

function normalizeMutationPayload(payload: CollectionMutationPayload) {
  return {
    id: payload.id || randomUUID(),
    name: payload.name.trim(),
    category: payload.category.trim(),
    price: payload.price.trim(),
    label: payload.label.trim(),
    icon: payload.icon,
    image: payload.image.trim(),
    images: payload.images.map((image) => image.trim()).filter(Boolean),
    badge: payload.badge.trim(),
    badgeTone: payload.badgeTone || "",
    sortOrder: Number.isFinite(payload.sortOrder) ? Math.max(1, payload.sortOrder) : 1,
    isActive: Boolean(payload.isActive),
  };
}

function validateMutationPayload(payload: CollectionMutationPayload) {
  if (!payload.name.trim()) {
    throw new Error("Nama koleksi wajib diisi.");
  }

  if (!payload.category.trim()) {
    throw new Error("Kategori wajib diisi.");
  }

  if (!payload.label.trim()) {
    throw new Error("Label wajib diisi.");
  }

  if (!allowedIcons.includes(payload.icon)) {
    throw new Error("Icon koleksi tidak valid.");
  }

  if (!payload.image.trim() && payload.images.length === 0) {
    throw new Error("Minimal satu URL gambar wajib diisi.");
  }
}

async function callAppsScript<T>(action: CollectionCrudAction, payload?: Record<string, unknown>) {
  const googleAppsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

  if (!googleAppsScriptUrl) {
    throw new Error("GOOGLE_APPS_SCRIPT_URL is not configured.");
  }

  const response = await fetch(googleAppsScriptUrl, {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      action,
      secret: process.env.ANZA_SECRET || "",
      ...payload,
    }),
  });

  if (!response.ok) {
    throw new Error(`Google Apps Script responded with ${response.status}.`);
  }

  return (await response.json()) as T;
}

async function fetchCollectionsFromPublicEndpoint(googleAppsScriptUrl: string) {
  const response = await fetch(googleAppsScriptUrl, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Google Apps Script responded with ${response.status}.`);
  }

  const payload = (await response.json()) as
    | RawCollectionRecord[]
    | { data?: RawCollectionRecord[]; items?: RawCollectionRecord[] };

  const rawItems = Array.isArray(payload)
    ? payload
    : Array.isArray(payload.data)
      ? payload.data
      : Array.isArray(payload.items)
        ? payload.items
        : [];

  return rawItems
    .map((item, index) => normalizeCollectionRecord(item, index))
    .filter((item): item is CollectionRecord => item !== null)
    .map((item) => ({
      ...item,
      isActive: true,
    }))
    .sort((left, right) => left.sortOrder - right.sortOrder);
}

function mapAppsScriptCrudError(message: string) {
  if (message === "Unsupported action.") {
    return "Google Apps Script belum di-update atau belum di-deploy ulang untuk fitur admin CRUD.";
  }

  return message;
}

export async function getAdminCollectionRecords(): Promise<CollectionRecord[]> {
  const googleAppsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

  if (!googleAppsScriptUrl) {
    return mapFallbackCollectionItems();
  }

  try {
    const result = await callAppsScript<AdminCollectionListResponse>("admin-list-collections");

    if (!result.ok) {
      if (result.message === "Unsupported action.") {
        return await fetchCollectionsFromPublicEndpoint(googleAppsScriptUrl);
      }

      throw new Error(result.message || "Failed to load collections.");
    }

    return (result.data || [])
      .map((item, index) => normalizeCollectionRecord(item as RawCollectionRecord, index))
      .filter((item): item is CollectionRecord => item !== null)
      .sort((left, right) => left.sortOrder - right.sortOrder);
  } catch (error) {
    console.error("Failed to load admin collections.", error);
    return mapFallbackCollectionItems();
  }
}

export async function createAdminCollectionRecord(payload: CollectionMutationPayload) {
  validateMutationPayload(payload);
  const normalizedPayload = normalizeMutationPayload(payload);

  const result = await callAppsScript<AdminCollectionMutationResponse>(
    "admin-create-collection",
    {
      ...normalizedPayload,
      images: normalizedPayload.images,
    },
  );

  if (!result.ok || !result.data) {
    throw new Error(
      mapAppsScriptCrudError(result.message || "Gagal menambah koleksi."),
    );
  }

  const normalizedRecord = normalizeCollectionRecord(result.data as RawCollectionRecord, 0);

  if (!normalizedRecord) {
    throw new Error("Data koleksi hasil simpan tidak valid.");
  }

  return normalizedRecord;
}

export async function updateAdminCollectionRecord(id: string, payload: CollectionMutationPayload) {
  validateMutationPayload(payload);
  const normalizedPayload = normalizeMutationPayload({
    ...payload,
    id,
  });

  const result = await callAppsScript<AdminCollectionMutationResponse>(
    "admin-update-collection",
    {
      ...normalizedPayload,
      images: normalizedPayload.images,
    },
  );

  if (!result.ok || !result.data) {
    throw new Error(
      mapAppsScriptCrudError(result.message || "Gagal mengubah koleksi."),
    );
  }

  const normalizedRecord = normalizeCollectionRecord(result.data as RawCollectionRecord, 0);

  if (!normalizedRecord) {
    throw new Error("Data koleksi hasil update tidak valid.");
  }

  return normalizedRecord;
}

export async function deleteAdminCollectionRecord(id: string) {
  const result = await callAppsScript<AdminCollectionMutationResponse>(
    "admin-delete-collection",
    { id },
  );

  if (!result.ok) {
    throw new Error(
      mapAppsScriptCrudError(result.message || "Gagal menghapus koleksi."),
    );
  }
}
