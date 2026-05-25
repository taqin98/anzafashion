import { redirect } from "next/navigation";

import { isAdminAuthenticated } from "@/lib/admin-auth.server";

export default async function AdminIndexPage() {
  if (await isAdminAuthenticated()) {
    redirect("/admin/dashboard");
  }

  redirect("/admin/login");
}
