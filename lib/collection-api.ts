import type { CollectionItem } from "@/lib/site-content";

export const COLLECTION_ITEMS_PER_PAGE = 6;

export type CollectionDataSource = "google-apps-script" | "fallback";

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
