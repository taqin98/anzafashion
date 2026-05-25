import { CollectionManager } from "@/components/admin/collection-manager";
import { getAdminCollectionRecords } from "@/lib/collection-admin.server";

export default async function AdminCollectionsPage() {
  const initialItems = await getAdminCollectionRecords();

  return <CollectionManager initialItems={initialItems} />;
}
