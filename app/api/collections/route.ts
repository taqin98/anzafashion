import { NextResponse } from "next/server";

import { COLLECTION_ITEMS_PER_PAGE } from "@/lib/collection-api";
import { getCollectionList } from "@/lib/collection-source.server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") ?? "1");
  const limit = Number(searchParams.get("limit") ?? String(COLLECTION_ITEMS_PER_PAGE));

  const payload = await getCollectionList({ page, limit });

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
