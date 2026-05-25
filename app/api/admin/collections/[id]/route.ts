import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth.server";
import {
  deleteAdminCollectionRecord,
  updateAdminCollectionRecord,
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

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return unauthorizedResponse();
  }

  try {
    const { id } = await context.params;
    const payload = (await request.json()) as CollectionMutationPayload;
    const data = await updateAdminCollectionRecord(id, payload);

    return NextResponse.json({
      ok: true,
      data,
      message: "Koleksi berhasil diperbarui.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message:
          error instanceof Error ? error.message : "Gagal memperbarui koleksi.",
      },
      { status: 400 },
    );
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return unauthorizedResponse();
  }

  try {
    const { id } = await context.params;
    await deleteAdminCollectionRecord(id);

    return NextResponse.json({
      ok: true,
      message: "Koleksi berhasil dihapus.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message:
          error instanceof Error ? error.message : "Gagal menghapus koleksi.",
      },
      { status: 400 },
    );
  }
}
