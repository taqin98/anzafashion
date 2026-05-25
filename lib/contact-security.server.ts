import "server-only";

import { createHash } from "node:crypto";

import {
  CONTACT_DUPLICATE_WINDOW_MS,
  CONTACT_FORM_MAX_SUBMIT_MS,
  CONTACT_FORM_MIN_SUBMIT_MS,
  CONTACT_RATE_LIMIT_MAX_REQUESTS,
  CONTACT_RATE_LIMIT_WINDOW_MS,
  type ContactRequestPayload,
} from "@/lib/contact-api";

type ContactSecurityPayload = {
  formStartedAt: number;
  website: string;
};

type RateLimitResult = {
  ok: boolean;
  retryAfterSeconds?: number;
};

type ContactRateLimitStore = {
  duplicateFingerprints: Map<string, number>;
  requestsByClient: Map<string, number[]>;
};

declare global {
  // eslint-disable-next-line no-var
  var __contactRateLimitStore__: ContactRateLimitStore | undefined;
}

function getRateLimitStore() {
  if (!globalThis.__contactRateLimitStore__) {
    globalThis.__contactRateLimitStore__ = {
      duplicateFingerprints: new Map(),
      requestsByClient: new Map(),
    };
  }

  return globalThis.__contactRateLimitStore__;
}

function getClientIdentifier(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const userAgent = request.headers.get("user-agent") || "unknown";
  const ipAddress = forwardedFor?.split(",")[0]?.trim() || realIp || "unknown";

  return `${ipAddress}:${userAgent}`;
}

function createPayloadFingerprint(payload: ContactRequestPayload) {
  return createHash("sha256")
    .update(
      JSON.stringify({
        fullName: payload.fullName.toLowerCase(),
        phoneNumber: payload.phoneNumber,
        serviceType: payload.serviceType.toLowerCase(),
        description: payload.description.toLowerCase(),
      }),
    )
    .digest("hex");
}

function cleanupOldEntries(now: number, timestamps: number[], windowMs: number) {
  return timestamps.filter((timestamp) => now - timestamp < windowMs);
}

function checkRateLimit(clientIdentifier: string, now: number): RateLimitResult {
  const store = getRateLimitStore();
  const recentRequests = cleanupOldEntries(
    now,
    store.requestsByClient.get(clientIdentifier) || [],
    CONTACT_RATE_LIMIT_WINDOW_MS,
  );

  if (recentRequests.length >= CONTACT_RATE_LIMIT_MAX_REQUESTS) {
    const oldestRequest = recentRequests[0];
    const retryAfterMs = CONTACT_RATE_LIMIT_WINDOW_MS - (now - oldestRequest);

    store.requestsByClient.set(clientIdentifier, recentRequests);

    return {
      ok: false,
      retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1000)),
    };
  }

  recentRequests.push(now);
  store.requestsByClient.set(clientIdentifier, recentRequests);

  return { ok: true };
}

function checkDuplicateSubmission(payload: ContactRequestPayload, now: number) {
  const store = getRateLimitStore();
  const fingerprint = createPayloadFingerprint(payload);
  const expiresAt = store.duplicateFingerprints.get(fingerprint);

  for (const [key, value] of store.duplicateFingerprints.entries()) {
    if (value <= now) {
      store.duplicateFingerprints.delete(key);
    }
  }

  if (expiresAt && expiresAt > now) {
    throw new Error("Pesan serupa baru saja dikirim. Coba lagi beberapa menit lagi.");
  }

  store.duplicateFingerprints.set(fingerprint, now + CONTACT_DUPLICATE_WINDOW_MS);
}

export function validateContactSubmissionSecurity(
  request: Request,
  securityPayload: ContactSecurityPayload,
  contactPayload: ContactRequestPayload,
) {
  const now = Date.now();

  if (securityPayload.website.trim()) {
    throw new Error("Spam submission detected.");
  }

  const fillDurationMs = now - securityPayload.formStartedAt;

  if (
    !Number.isFinite(securityPayload.formStartedAt) ||
    securityPayload.formStartedAt <= 0 ||
    fillDurationMs < CONTACT_FORM_MIN_SUBMIT_MS
  ) {
    throw new Error("Form dikirim terlalu cepat. Silakan coba lagi.");
  }

  if (fillDurationMs > CONTACT_FORM_MAX_SUBMIT_MS) {
    throw new Error("Sesi form sudah terlalu lama. Muat ulang halaman lalu coba lagi.");
  }

  const requestOrigin = request.headers.get("origin");

  if (requestOrigin) {
    const originHost = new URL(requestOrigin).host;
    const requestHost = new URL(request.url).host;

    if (originHost !== requestHost) {
      throw new Error("Origin request tidak valid.");
    }
  }

  const clientIdentifier = getClientIdentifier(request);
  const rateLimitResult = checkRateLimit(clientIdentifier, now);

  if (!rateLimitResult.ok) {
    const error = new Error("Terlalu banyak percobaan kirim. Coba lagi beberapa menit lagi.");
    (error as Error & { retryAfterSeconds?: number }).retryAfterSeconds =
      rateLimitResult.retryAfterSeconds;
    throw error;
  }

  checkDuplicateSubmission(contactPayload, now);
}
