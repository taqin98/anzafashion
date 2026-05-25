import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth.server";
import {
  createAdminCollectionRecord,
  getAdminCollectionRecords,
} from "@/lib/collection-admin.server";
import type { CollectionMutationPayload } from "@/lib/collection-api";

function unauthorizedResponse() {
  return NextResponse.json(
    {
      ok: false,
      message: "Unauthorized.",
    },
    { status: 401 },
  );
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return unauthorizedResponse();
  }

  const data = await getAdminCollectionRecords();

  return NextResponse.json({
    ok: true,
    data,
  });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return unauthorizedResponse();
  }

  try {
    const payload = (await request.json()) as CollectionMutationPayload;
    const data = await createAdminCollectionRecord(payload);

    return NextResponse.json({
      ok: true,
      data,
      message: "Koleksi berhasil ditambahkan.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message:
          error instanceof Error ? error.message : "Gagal menambah koleksi.",
      },
      { status: 400 },
    );
  }
}
