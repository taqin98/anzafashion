export type ContactRequestPayload = {
  fullName: string;
  phoneNumber: string;
  serviceType: string;
  description: string;
};

export type ContactRequestResponse = {
  ok: boolean;
  message: string;
};

const MAX_WHATSAPP_DIGITS = 15;
const INDONESIAN_WHATSAPP_PATTERN = /^628\d{7,12}$/;

export function sanitizeWhatsappNumber(value: string) {
  return value.replace(/\D/g, "").slice(0, MAX_WHATSAPP_DIGITS);
}

export function formatWhatsappNumber(value: string) {
  const digits = sanitizeWhatsappNumber(value);

  if (!digits) {
    return "";
  }

  if (digits.startsWith("62")) {
    return [digits.slice(0, 2), digits.slice(2, 5), digits.slice(5, 9), digits.slice(9, 13), digits.slice(13, 15)]
      .filter(Boolean)
      .join("-");
  }

  return [digits.slice(0, 4), digits.slice(4, 8), digits.slice(8, 12), digits.slice(12, 15)]
    .filter(Boolean)
    .join("-");
}

export function normalizeWhatsappNumber(value: string) {
  const digits = sanitizeWhatsappNumber(value);

  if (!digits) {
    return "";
  }

  if (digits.startsWith("62")) {
    return digits;
  }

  if (digits.startsWith("0")) {
    return `62${digits.slice(1)}`;
  }

  if (digits.startsWith("8")) {
    return `62${digits}`;
  }

  return digits;
}

export function getWhatsappNumberError(value: string) {
  const normalizedNumber = normalizeWhatsappNumber(value);

  if (!normalizedNumber) {
    return "No. WhatsApp wajib diisi.";
  }

  if (!INDONESIAN_WHATSAPP_PATTERN.test(normalizedNumber)) {
    return "Gunakan nomor WhatsApp Indonesia yang valid, misalnya 0812-3456-7890.";
  }

  return "";
}
