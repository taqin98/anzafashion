"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { AdminLogoutButton } from "@/components/admin/logout-button";

const navigationItems = [
  {
    href: "/admin/dashboard",
    label: "Ringkasan",
    shortLabel: "Ringkas",
    icon: (
      <svg viewBox="0 0 24 24" className="size-[18px] fill-none stroke-current [stroke-width:1.8]">
        <path d="M4 13h6V4H4v9Zm10 7h6V11h-6v9ZM4 20h6v-3H4v3Zm10-13h6V4h-6v3Z" />
      </svg>
    ),
  },
  {
    href: "/admin/collections",
    label: "Koleksi",
    shortLabel: "Koleksi",
    icon: (
      <svg viewBox="0 0 24 24" className="size-[18px] fill-none stroke-current [stroke-width:1.8]">
        <path d="M6 8 12 4l6 4v10l-6 2-6-2V8Z" />
        <path d="M6 8l6 4 6-4M12 12v8" />
      </svg>
    ),
  },
];

function classNames(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const activeNavigationItem =
    navigationItems.find((item) => pathname.startsWith(item.href)) || navigationItems[0];

  return (
    <div className="min-h-screen bg-[#efe5d7] text-[var(--charcoal)]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] flex-col bg-[#16110d] text-[#f3e3bc] lg:flex">
        <div className="border-b border-[#3b2d20] px-6 pb-5 pt-6">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-[4px] bg-[#b8860b] font-serif-display text-[0.95rem] text-white">
              A
            </div>
            <div>
              <div className="text-[0.82rem] uppercase tracking-[0.16em] text-[#f3e3bc]">
                Anza Fashion
              </div>
              <div className="mt-1 text-[0.58rem] uppercase tracking-[0.24em] text-[#b79d74]">
                Admin Panel
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-[#2a2018] py-4">
          <div className="px-6 pb-3 text-[0.6rem] uppercase tracking-[0.28em] text-[#8f7550]">
            Utama
          </div>
          <nav className="space-y-1.5 px-3">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={classNames(
                    "flex items-center gap-3 rounded-2xl border px-4 py-3 font-sans text-[0.86rem] transition",
                    isActive
                      ? "border-[#6b5228] bg-[#2b2016] text-[#f3e3bc] shadow-[0_12px_30px_rgba(0,0,0,0.18)]"
                      : "border-transparent text-[#d3bf9a] hover:border-[#3b2d20] hover:bg-[#221912] hover:text-[#f3e3bc]",
                  )}
                >
                  <span
                    className={classNames(
                      "flex size-9 shrink-0 items-center justify-center rounded-xl",
                      isActive ? "bg-[#b8860b] text-white" : "bg-[#211912] text-[#d4a017]",
                    )}
                  >
                    {item.icon}
                  </span>
                  <span className="truncate font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto border-t border-[#2a2018] px-6 py-5">
          <div className="flex items-center gap-3 rounded-2xl border border-[#302419] bg-[#201812] px-4 py-3">
            <div className="flex size-9 items-center justify-center rounded-full bg-[#3a2e22] font-sans text-[0.72rem] text-[#d4a017]">
              AF
            </div>
            <div className="min-w-0">
              <div className="truncate font-sans text-[0.8rem] text-[#f3e3bc]">
                Admin Anza
              </div>
              <div className="mt-0.5 text-[0.62rem] uppercase tracking-[0.16em] text-[#a58a61]">
                Super Admin
              </div>
            </div>
          </div>

          <div className="mt-4">
            <AdminLogoutButton />
          </div>
        </div>
      </aside>

      <div className="lg:pl-[248px]">
        <header className="sticky top-0 z-30 border-b border-[rgba(44,36,32,0.08)] bg-[rgba(22,17,13,0.96)] px-4 py-3 text-[#f3e3bc] shadow-[0_16px_30px_rgba(22,17,13,0.2)] backdrop-blur lg:hidden">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[0.62rem] uppercase tracking-[0.28em] text-[#b79d74]">
                Anza Fashion
              </div>
              <div className="mt-1 truncate font-serif-display text-[1.1rem] text-[#f3e3bc]">
                {activeNavigationItem.label}
              </div>
            </div>

            <div className="flex size-10 items-center justify-center rounded-2xl bg-[#2b2016] text-[#d4a017]">
              {activeNavigationItem.icon}
            </div>
          </div>
        </header>

        <div className="min-h-screen pb-[92px] lg:pb-0">
          <div className="mx-auto max-w-[1440px]">
            {children}
          </div>
        </div>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[rgba(58,46,34,0.24)] bg-[rgba(22,17,13,0.98)] px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-20px_40px_rgba(0,0,0,0.16)] backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-md items-center justify-between gap-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={classNames(
                  "flex min-w-0 flex-1 items-center justify-center gap-2 rounded-2xl px-3 py-3 font-sans text-[0.8rem] font-medium transition",
                  isActive
                    ? "bg-[#2b2016] text-[#f3e3bc]"
                    : "text-[#cfba94] hover:bg-[#2a1e12] hover:text-[#f3e3bc]",
                )}
              >
                <span
                  className={classNames(
                    "flex size-8 shrink-0 items-center justify-center rounded-xl",
                    isActive ? "bg-[#b8860b] text-white" : "bg-[#241c15] text-[#d4a017]",
                  )}
                >
                  {item.icon}
                </span>
                <span className="truncate">{item.shortLabel}</span>
              </Link>
            );
          })}

          <div className="shrink-0">
            <AdminLogoutButton mobile />
          </div>
        </div>
      </nav>
    </div>
  );
}
