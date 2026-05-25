"use client";

import { useEffect, useRef, useState } from "react";

import type {
  ContactRequestPayload,
  ContactRequestResponse,
} from "@/lib/contact-api";
import { serviceOptions } from "@/lib/site-content";

const fieldClassName =
  "w-full border border-[var(--soft-gray)] bg-[var(--warm-white)] px-4 py-3 text-sm text-[var(--charcoal)] outline-none transition focus:border-[var(--rose)]";

export function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload: ContactRequestPayload = {
      fullName: String(formData.get("fullName") || "").trim(),
      phoneNumber: String(formData.get("phoneNumber") || "").trim(),
      serviceType: String(formData.get("serviceType") || "").trim(),
      description: String(formData.get("description") || "").trim(),
    };

    setSubmitError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as ContactRequestResponse;

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "Pesan belum dapat dikirim.");
      }

      setIsSubmitted(true);
      form.reset();

      timeoutRef.current = window.setTimeout(() => {
        setIsSubmitted(false);
        timeoutRef.current = null;
      }, 3000);
    } catch (error) {
      setIsSubmitted(false);
      setSubmitError(
        error instanceof Error ? error.message : "Pesan belum dapat dikirim.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label
            className="text-[0.72rem] uppercase tracking-[0.12em] text-[var(--warm-gray)]"
            htmlFor="full-name"
          >
            Nama Lengkap
          </label>
          <input
            id="full-name"
            name="fullName"
            type="text"
            required
            className={fieldClassName}
            placeholder="Nama Anda"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label
            className="text-[0.72rem] uppercase tracking-[0.12em] text-[var(--warm-gray)]"
            htmlFor="phone-number"
          >
            No. WhatsApp
          </label>
          <input
            id="phone-number"
            name="phoneNumber"
            type="tel"
            required
            className={fieldClassName}
            placeholder="08xx-xxxx-xxxx"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label
          className="text-[0.72rem] uppercase tracking-[0.12em] text-[var(--warm-gray)]"
          htmlFor="service-type"
        >
          Jenis Layanan
        </label>
        <select
          id="service-type"
          name="serviceType"
          defaultValue=""
          required
          className={`${fieldClassName} appearance-none cursor-pointer bg-no-repeat pr-10`}
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%237A6B63' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
            backgroundPosition: "right 1rem center",
          }}
        >
          <option value="">Pilih Layanan...</option>
          {serviceOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label
          className="text-[0.72rem] uppercase tracking-[0.12em] text-[var(--warm-gray)]"
          htmlFor="description"
        >
          Keterangan
        </label>
        <textarea
          id="description"
          name="description"
          required
          className={`${fieldClassName} min-h-[120px] resize-none`}
          placeholder="Ceritakan model yang Anda inginkan, ukuran, bahan, warna, dll..."
        />
      </div>

      {submitError ? (
        <p className="text-sm text-[var(--rose-dark)]">{submitError}</p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting || isSubmitted}
        className={`inline-flex self-start px-10 py-4 text-[0.8rem] uppercase tracking-[0.15em] text-white transition ${
          isSubmitted
            ? "cursor-default bg-[var(--success)]"
            : isSubmitting
              ? "cursor-wait bg-[var(--warm-gray)]"
            : "cursor-pointer bg-[var(--rose)] hover:-translate-y-px hover:bg-[var(--rose-dark)]"
        }`}
      >
        {isSubmitted ? "OK Pesan Terkirim!" : isSubmitting ? "Mengirim..." : "Kirim Pesanan"}
      </button>
    </form>
  );
}
