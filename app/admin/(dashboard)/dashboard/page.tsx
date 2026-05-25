import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { getAdminCollectionRecords } from "@/lib/collection-admin.server";

export default async function AdminDashboardPage() {
  const items = await getAdminCollectionRecords();

  return (
    <>
      <AdminTopbar
        title="Ringkasan"
        subtitle="Pantau koleksi yang tampil dan yang masih disembunyikan dari website"
      />
      <AdminDashboard items={items} />
    </>
  );
}
