import "server-only";

import type {
  ContactRequestSubmission,
  ContactRequestPayload,
  ContactRequestResponse,
} from "@/lib/contact-api";
import {
  CONTACT_MAX_DESCRIPTION_LENGTH,
  CONTACT_MAX_NAME_LENGTH,
  getWhatsappNumberError,
  normalizeWhatsappNumber,
} from "@/lib/contact-api";

function normalizeInput(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function parseContactRequestSubmission(payload: unknown): ContactRequestSubmission {
  if (!payload || typeof payload !== "object") {
    throw new Error("Invalid request payload.");
  }

  const record = payload as Record<string, unknown>;

  return {
    fullName: normalizeInput(record.fullName),
    phoneNumber: normalizeWhatsappNumber(normalizeInput(record.phoneNumber)),
    serviceType: normalizeInput(record.serviceType),
    description: normalizeInput(record.description),
    website: normalizeInput(record.website),
    formStartedAt: Number(record.formStartedAt),
  };
}

export function validateContactRequestPayload(payload: ContactRequestPayload) {
  if (!payload.fullName) {
    throw new Error("Nama lengkap wajib diisi.");
  }

  if (payload.fullName.length > CONTACT_MAX_NAME_LENGTH) {
    throw new Error("Nama lengkap terlalu panjang.");
  }

  if (!payload.phoneNumber) {
    throw new Error("No. WhatsApp wajib diisi.");
  }

  const phoneNumberError = getWhatsappNumberError(payload.phoneNumber);

  if (phoneNumberError) {
    throw new Error(phoneNumberError);
  }

  if (!payload.serviceType) {
    throw new Error("Jenis layanan wajib dipilih.");
  }

  if (!payload.description) {
    throw new Error("Keterangan wajib diisi.");
  }

  if (payload.description.length > CONTACT_MAX_DESCRIPTION_LENGTH) {
    throw new Error("Keterangan terlalu panjang.");
  }
}

export async function submitContactRequest(
  payload: ContactRequestPayload,
): Promise<ContactRequestResponse> {
  const googleAppsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
  const contactFormSecret = process.env.ANZA_SECRET;

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
      action: "create-contact-request",
      ...(contactFormSecret ? { secret: contactFormSecret } : {}),
      ...payload,
    }),
  });

  if (!response.ok) {
    throw new Error(`Google Apps Script responded with ${response.status}.`);
  }

  const result = (await response.json()) as Partial<ContactRequestResponse>;

  if (!result.ok) {
    throw new Error(result.message || "Failed to store contact request.");
  }

  return {
    ok: true,
    message: result.message || "Pesan berhasil dikirim.",
  };
}
