import type {
  CollectionIcon,
  CollectionItem,
} from "@/lib/site-content";

export const COLLECTION_ITEMS_PER_PAGE = 6;

export type CollectionDataSource = "google-apps-script" | "fallback";
export type CollectionCrudAction =
  | "admin-list-collections"
  | "admin-create-collection"
  | "admin-update-collection"
  | "admin-delete-collection";

export type CollectionRecord = Omit<CollectionItem, "image" | "images"> & {
  image?: string;
  images: string[];
  isActive: boolean;
  sortOrder: number;
};

export type CollectionMutationPayload = {
  id?: string;
  name: string;
  category: string;
  price: string;
  label: string;
  icon: CollectionIcon;
  image: string;
  images: string[];
  badge: string;
  badgeTone: CollectionItem["badgeTone"];
  sortOrder: number;
  isActive: boolean;
};

export type CollectionListMeta = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  source: CollectionDataSource;
};

export type CollectionListResponse = {
  data: CollectionItem[];
  meta: CollectionListMeta;
};

export type AdminCollectionListResponse = {
  ok: boolean;
  data: CollectionRecord[];
  message?: string;
};

export type AdminCollectionMutationResponse = {
  ok: boolean;
  data?: CollectionRecord;
  message: string;
};
