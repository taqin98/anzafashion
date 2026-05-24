"use client";

import { useEffect, useRef, useState } from "react";

import { serviceOptions } from "@/lib/site-content";

const fieldClassName =
  "w-full border border-[var(--soft-gray)] bg-[var(--warm-white)] px-4 py-3 text-sm text-[var(--charcoal)] outline-none transition focus:border-[var(--rose)]";

export function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    const form = event.currentTarget;
    setIsSubmitted(true);

    timeoutRef.current = window.setTimeout(() => {
      setIsSubmitted(false);
      form.reset();
      timeoutRef.current = null;
    }, 3000);
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
          className={`${fieldClassName} min-h-[120px] resize-none`}
          placeholder="Ceritakan model yang Anda inginkan, ukuran, bahan, warna, dll..."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitted}
        className={`inline-flex self-start px-10 py-4 text-[0.8rem] uppercase tracking-[0.15em] text-white transition ${
          isSubmitted
            ? "cursor-default bg-[var(--success)]"
            : "cursor-pointer bg-[var(--rose)] hover:-translate-y-px hover:bg-[var(--rose-dark)]"
        }`}
      >
        {isSubmitted ? "OK Pesan Terkirim!" : "Kirim Pesanan"}
      </button>
    </form>
  );
}

