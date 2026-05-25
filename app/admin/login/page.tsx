import { redirect } from "next/navigation";

import { AdminLoginForm } from "@/components/admin/login-form";
import { isAdminAuthenticated } from "@/lib/admin-auth.server";

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) {
    redirect("/admin/dashboard");
  }

  return (
    <main className="min-h-screen bg-[#f4ece1] px-4 py-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md items-center">
        <section className="w-full overflow-hidden rounded-[24px] border border-[#e7d8c3] bg-[#fdf8f0] shadow-[0_28px_80px_rgba(28,22,16,0.14)]">
          <div className="bg-[#1c1610] px-6 py-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-[6px] bg-[#b8860b] font-serif-display text-[1rem] text-white">
                A
              </div>
              <div>
                <div className="text-[0.9rem] uppercase tracking-[0.16em] text-[#e8d5a3]">
                  Anza Fashion
                </div>
                <div className="mt-1 text-[0.58rem] uppercase tracking-[0.28em] text-[#7a6a50]">
                  Admin Panel
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-7">
            <div className="mb-6">
              <div className="font-sans text-[0.68rem] uppercase tracking-[0.24em] text-[#b8860b]">
                Secure Access
              </div>
              <h1 className="mt-2 font-serif-display text-[2.1rem] font-light leading-[1.02] text-[#2c2420]">
                Login
                <br />
                Admin
              </h1>
              <p className="mt-3 font-sans text-[0.88rem] leading-6 text-[#7a6b63]">
                Masuk untuk mengelola konten koleksi pilihan website Anza Fashion.
              </p>
            </div>

            <AdminLoginForm />
          </div>
        </section>
      </div>
    </main>
  );
}
