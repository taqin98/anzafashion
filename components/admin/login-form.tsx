"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const result = (await response.json()) as {
        ok: boolean;
        message?: string;
      };

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "Login gagal.");
      }

      router.replace("/admin/dashboard");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Login gagal diproses.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label
          className="block font-sans text-[0.68rem] uppercase tracking-[0.22em] text-[#7a6a50]"
          htmlFor="admin-username"
        >
          Username
        </label>
        <input
          id="admin-username"
          type="text"
          autoComplete="username"
          required
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className="w-full rounded-[14px] border border-[#d9cdbb] bg-[#fbf6ef] px-4 py-3 font-sans text-[0.92rem] text-[#2c2420] outline-none transition focus:border-[#b8860b]"
          placeholder="Masukkan username"
        />
      </div>

      <div className="space-y-2">
        <label
          className="block font-sans text-[0.68rem] uppercase tracking-[0.22em] text-[#7a6a50]"
          htmlFor="admin-password"
        >
          Password
        </label>
        <div className="flex items-center gap-2 rounded-[14px] border border-[#d9cdbb] bg-[#fbf6ef] pr-2 transition focus-within:border-[#b8860b]">
          <input
            id="admin-password"
            type={isPasswordVisible ? "text" : "password"}
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-[14px] border-none bg-transparent px-4 py-3 font-sans text-[0.92rem] text-[#2c2420] outline-none"
            placeholder="Masukkan password"
          />
          <button
            type="button"
            onClick={() => setIsPasswordVisible((currentState) => !currentState)}
            className="shrink-0 rounded-[10px] px-3 py-2 font-sans text-[0.75rem] text-[#7a6a50] transition hover:bg-[#f3ece2]"
          >
            {isPasswordVisible ? "Sembunyikan" : "Lihat"}
          </button>
        </div>
      </div>

      <div className="rounded-[14px] border border-[#eadfce] bg-[#fbf6ef] px-4 py-3 font-sans text-[0.8rem] leading-6 text-[#7a6a50]">
        Gunakan username dan password admin yang sudah disiapkan. Jika lupa, hubungi pengelola website.
      </div>

      {error ? (
        <div className="rounded-[14px] border border-[#d7b186] bg-[#fff2df] px-4 py-3 font-sans text-[0.82rem] text-[#8b5347]">
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center rounded-[14px] bg-[#b8860b] px-5 py-3.5 font-sans text-[0.85rem] font-medium uppercase tracking-[0.12em] text-white transition hover:bg-[#a07808] disabled:cursor-wait disabled:opacity-70"
      >
        {isSubmitting ? "Memeriksa..." : "Masuk ke Admin"}
      </button>
    </form>
  );
}
