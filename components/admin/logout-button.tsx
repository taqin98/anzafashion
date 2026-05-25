"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminLogoutButton({ mobile = false }: { mobile?: boolean }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogout() {
    setIsSubmitting(true);

    try {
      await fetch("/api/admin/logout", {
        method: "POST",
      });
    } finally {
      router.replace("/admin/login");
      router.refresh();
      setIsSubmitting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isSubmitting}
      className={
        mobile
          ? "flex size-12 items-center justify-center rounded-2xl border border-[#3a2e22] bg-[#241c15] text-[#d4a017] transition hover:bg-[#2a1e12] disabled:opacity-60"
          : "rounded-md border border-[rgba(212,160,23,0.22)] px-3 py-1.5 font-sans text-[0.75rem] text-[#d4a017] transition hover:bg-[rgba(212,160,23,0.08)] disabled:opacity-60"
      }
      aria-label="Logout"
    >
      {mobile ? (
        <svg viewBox="0 0 24 24" className="size-[18px] fill-none stroke-current [stroke-width:1.8]">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <path d="m16 17 5-5-5-5" />
          <path d="M21 12H9" />
        </svg>
      ) : (
        <span>{isSubmitting ? "Keluar..." : "Logout"}</span>
      )}
    </button>
  );
}
