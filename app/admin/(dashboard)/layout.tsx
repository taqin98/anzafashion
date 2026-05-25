import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdminAuth } from "@/lib/admin-auth.server";

export default async function AdminDashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await requireAdminAuth();

  return <AdminShell>{children}</AdminShell>;
}
