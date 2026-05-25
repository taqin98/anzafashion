import { NextResponse } from "next/server";

import {
  parseContactRequestSubmission,
  submitContactRequest,
  validateContactRequestPayload,
} from "@/lib/contact-submit.server";
import { validateContactSubmissionSecurity } from "@/lib/contact-security.server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const rawPayload = await request.json();
    const submission = parseContactRequestSubmission(rawPayload);
    const { website, formStartedAt, ...payload } = submission;

    validateContactRequestPayload(payload);
    validateContactSubmissionSecurity(
      request,
      {
        website,
        formStartedAt,
      },
      payload,
    );

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
    const retryAfterSeconds =
      error instanceof Error &&
      "retryAfterSeconds" in error &&
      typeof error.retryAfterSeconds === "number"
        ? error.retryAfterSeconds
        : undefined;

    return NextResponse.json(
      {
        ok: false,
        message,
        retryAfterSeconds,
      },
      {
        status: retryAfterSeconds ? 429 : 400,
        headers: {
          "Cache-Control": "no-store",
          ...(retryAfterSeconds ? { "Retry-After": String(retryAfterSeconds) } : {}),
        },
      },
    );
  }
}
