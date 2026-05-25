import "server-only";

import {
  COLLECTION_ITEMS_PER_PAGE,
  type CollectionDataSource,
  type CollectionListResponse,
} from "@/lib/collection-api";
import {
  collectionItems as fallbackCollectionItems,
  type CollectionIcon,
  type CollectionItem,
} from "@/lib/site-content";

type RawCollectionRecord = Record<string, unknown>;

type NormalizedCollectionRecord = {
  name: string;
  category: string;
  price: string;
  label: string;
  icon: CollectionIcon;
  image: string | undefined;
  images: string[];
  badge: string | undefined;
  badgeTone: CollectionItem["badgeTone"];
  isActive: boolean;
  sortOrder: number;
};

const allowedIcons: CollectionIcon[] = ["kebaya", "dress", "blouse", "gamis"];
const allowedBadgeTones = ["rose", "terracotta"] as const;

function toPositiveInteger(value: number, fallback: number, max?: number) {
  const normalizedValue = Number.isFinite(value) && value > 0 ? Math.floor(value) : fallback;

  if (typeof max === "number") {
    return Math.min(normalizedValue, max);
  }

  return normalizedValue;
}

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

  if (!normalizedValue) {
    return fallback;
  }

  if (["true", "1", "yes", "y", "active"].includes(normalizedValue)) {
    return true;
  }

  if (["false", "0", "no", "n", "inactive"].includes(normalizedValue)) {
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

function normalizeBadgeTone(value: string) {
  const normalizedValue = value.trim().toLowerCase();

  return allowedBadgeTones.includes(normalizedValue as (typeof allowedBadgeTones)[number])
    ? (normalizedValue as (typeof allowedBadgeTones)[number])
    : undefined;
}

function normalizeCollectionRecord(
  record: RawCollectionRecord,
  index: number,
): NormalizedCollectionRecord | null {
  const name = readString(record, ["name", "title", "product_name"]);

  if (!name) {
    return null;
  }

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
    sortOrder: Number.isFinite(sortOrderValue) ? sortOrderValue : index,
  } satisfies NormalizedCollectionRecord;
}

async function fetchRemoteCollections(): Promise<{
  items: CollectionItem[];
  source: CollectionDataSource;
}> {
  const googleAppsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

  if (!googleAppsScriptUrl) {
    return { items: fallbackCollectionItems, source: "fallback" };
  }

  try {
    const response = await fetch(googleAppsScriptUrl, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Google Apps Script responded with ${response.status}`);
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

    const normalizedItems = rawItems
      .map((record, index) => normalizeCollectionRecord(record, index))
      .filter((record): record is NormalizedCollectionRecord => record !== null)
      .filter((record) => record.isActive)
      .sort((left, right) => left.sortOrder - right.sortOrder)
      .map(({ isActive: _isActive, sortOrder: _sortOrder, ...item }) => item);

    return { items: normalizedItems, source: "google-apps-script" };
  } catch (error) {
    console.error("Failed to load collections from Google Apps Script.", error);
    return { items: fallbackCollectionItems, source: "fallback" };
  }
}

export async function getCollectionList({
  page = 1,
  limit = COLLECTION_ITEMS_PER_PAGE,
}: {
  page?: number;
  limit?: number;
} = {}): Promise<CollectionListResponse> {
  const normalizedLimit = toPositiveInteger(limit, COLLECTION_ITEMS_PER_PAGE, 24);
  const requestedPage = toPositiveInteger(page, 1);
  const { items, source } = await fetchRemoteCollections();

  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / normalizedLimit));
  const currentPage = Math.min(requestedPage, totalPages);
  const startIndex = (currentPage - 1) * normalizedLimit;
  const data = items.slice(startIndex, startIndex + normalizedLimit);

  return {
    data,
    meta: {
      page: currentPage,
      limit: normalizedLimit,
      totalItems,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
      source,
    },
  };
}
