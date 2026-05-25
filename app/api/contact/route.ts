import { NextResponse } from "next/server";

import {
  parseContactRequestPayload,
  submitContactRequest,
  validateContactRequestPayload,
} from "@/lib/contact-submit.server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const rawPayload = await request.json();
    const payload = parseContactRequestPayload(rawPayload);

    validateContactRequestPayload(payload);

    const result = await submitContactRequest(payload);

    return NextResponse.json(result, {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Terjadi kesalahan saat mengirim pesan.";

    return NextResponse.json(
      {
        ok: false,
        message,
      },
      {
        status: 400,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }
}
