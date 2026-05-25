import type { CollectionRecord } from "@/lib/collection-api";

const iconLabels: Record<CollectionRecord["icon"], string> = {
  kebaya: "Kebaya",
  dress: "Dress",
  blouse: "Atasan / Blouse",
  gamis: "Gamis",
};

function classNames(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function groupCountBy(
  items: CollectionRecord[],
  selector: (item: CollectionRecord) => string,
) {
  const map = new Map<string, number>();

  for (const item of items) {
    const key = selector(item) || "Lainnya";
    map.set(key, (map.get(key) || 0) + 1);
  }

  return Array.from(map.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((left, right) => right.value - left.value);
}

function StatCard({
  label,
  value,
  note,
  tone,
  icon,
}: {
  label: string;
  value: string | number;
  note: string;
  tone: "gold" | "teal" | "coral" | "purple";
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-[18px] border border-[rgba(44,36,32,0.08)] bg-[#fdf8f0] p-4 shadow-[0_10px_30px_rgba(28,22,16,0.04)]">
      <div
        className={classNames(
          "mb-3 flex size-9 items-center justify-center rounded-[10px]",
          tone === "gold" && "bg-[#fdf0cc] text-[#b8860b]",
          tone === "teal" && "bg-[#e1f5ee] text-[#1d9e75]",
          tone === "coral" && "bg-[#faece7] text-[#d85a30]",
          tone === "purple" && "bg-[#eeedfe] text-[#7f77dd]",
        )}
      >
        {icon}
      </div>
      <div className="font-sans text-[0.68rem] uppercase tracking-[0.12em] text-[#7a6b63]">
        {label}
      </div>
      <div className="mt-2 font-serif-display text-[1.9rem] text-[#2c2420]">{value}</div>
      <div className="mt-1 font-sans text-[0.72rem] text-[#7a6b63]">{note}</div>
    </div>
  );
}

function MiniBarList({
  title,
  items,
  palette,
}: {
  title: string;
  items: Array<{ label: string; value: number }>;
  palette: string[];
}) {
  const highestValue = Math.max(...items.map((item) => item.value), 1);

  return (
    <section className="rounded-[18px] border border-[rgba(44,36,32,0.08)] bg-[#fdf8f0] p-5">
      <div className="mb-4 font-sans text-[0.72rem] uppercase tracking-[0.18em] text-[#7a6b63]">
        {title}
      </div>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={item.label}>
            <div className="mb-1 flex items-center justify-between gap-3 font-sans text-[0.8rem] text-[#7a6b63]">
              <span className="truncate">{item.label}</span>
              <span>{item.value}</span>
            </div>
            <div className="h-[6px] overflow-hidden rounded-full bg-[#efe5d7]">
              <div
                className="h-full rounded-full transition-[width]"
                style={{
                  width: `${Math.max((item.value / highestValue) * 100, 8)}%`,
                  backgroundColor: palette[index % palette.length],
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function AdminDashboard({ items }: { items: CollectionRecord[] }) {
  const activeItems = items.filter((item) => item.isActive);
  const draftItems = items.filter((item) => !item.isActive);
  const totalImages = items.reduce(
    (total, item) => total + (item.images.length > 0 ? item.images.length : item.image ? 1 : 0),
    0,
  );
  const categoryStats = groupCountBy(items, (item) => item.category);
  const iconStats = groupCountBy(items, (item) => iconLabels[item.icon]);
  const recentItems = [...items]
    .sort((left, right) => left.sortOrder - right.sortOrder)
    .slice(0, 6);

  return (
    <div className="space-y-5 px-4 pb-24 pt-4 lg:px-7 lg:pb-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Koleksi"
          value={items.length}
          note="Seluruh item yang tersimpan"
          tone="gold"
          icon={
            <svg viewBox="0 0 24 24" className="size-5 fill-none stroke-current [stroke-width:1.8]">
              <path d="M6 8 12 4l6 4v10l-6 2-6-2V8Z" />
              <path d="M6 8l6 4 6-4" />
            </svg>
          }
        />
        <StatCard
          label="Sedang Tampil"
          value={activeItems.length}
          note="Tampil di landing page"
          tone="teal"
          icon={
            <svg viewBox="0 0 24 24" className="size-5 fill-none stroke-current [stroke-width:1.8]">
              <path d="m5 12 4 4L19 6" />
            </svg>
          }
        />
        <StatCard
          label="Disembunyikan"
          value={draftItems.length}
          note="Belum ditayangkan"
          tone="purple"
          icon={
            <svg viewBox="0 0 24 24" className="size-5 fill-none stroke-current [stroke-width:1.8]">
              <path d="M12 8v5l3 3" />
              <circle cx="12" cy="12" r="8" />
            </svg>
          }
        />
        <StatCard
          label="Total Aset Gambar"
          value={totalImages}
          note="Cover dan gallery produk"
          tone="coral"
          icon={
            <svg viewBox="0 0 24 24" className="size-5 fill-none stroke-current [stroke-width:1.8]">
              <rect x="4" y="5" width="16" height="14" rx="2" />
              <circle cx="9" cy="10" r="1.5" />
              <path d="m20 15-4.5-4.5L8 18" />
            </svg>
          }
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.7fr_1fr]">
        <MiniBarList
          title="Distribusi Kategori"
          items={categoryStats.length > 0 ? categoryStats : [{ label: "Belum ada data", value: 0 }]}
          palette={["#d4a017", "#1d9e75", "#7f77dd", "#d85a30", "#8b5347"]}
        />
        <MiniBarList
          title="Jenis Produk"
          items={iconStats.length > 0 ? iconStats : [{ label: "Belum ada data", value: 0 }]}
          palette={["#d4a017", "#7f77dd", "#d85a30", "#1d9e75"]}
        />
      </div>

      <section className="overflow-hidden rounded-[18px] border border-[rgba(44,36,32,0.08)] bg-[#fdf8f0]">
        <div className="flex items-center justify-between gap-3 border-b border-[rgba(44,36,32,0.08)] px-5 py-4">
          <div className="font-sans text-[0.72rem] uppercase tracking-[0.18em] text-[#7a6b63]">
            Urutan Tampil Koleksi
          </div>
          <div className="font-sans text-[0.76rem] text-[#b8860b]">
            {recentItems.length} item
          </div>
        </div>

        <div className="space-y-3 p-3 sm:hidden">
          {recentItems.map((item) => (
            <article
              key={item.id}
              className="rounded-[16px] border border-[rgba(44,36,32,0.08)] bg-white px-4 py-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate font-medium text-[#2c2420]">{item.name}</div>
                  <div className="mt-1 text-[0.74rem] text-[#7a6b63]">{item.category}</div>
                  <div className="mt-1 text-[0.72rem] text-[#9a8a70]">{item.id}</div>
                </div>
                <div className="rounded-full bg-[#fbf0d0] px-3 py-1 font-serif-display text-[0.92rem] text-[#b8860b]">
                  #{item.sortOrder}
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2 text-[0.72rem]">
                <span
                  className={classNames(
                    "rounded-full px-2.5 py-1 uppercase tracking-[0.12em]",
                    item.isActive ? "bg-[#eaf3de] text-[#3b6d11]" : "bg-[#eeedfe] text-[#534ab7]",
                  )}
                >
                  {item.isActive ? "Tampil" : "Disembunyikan"}
                </span>
                <span className="rounded-full bg-[#fbf5eb] px-2.5 py-1 text-[#7a6b63]">
                  Foto {item.images.length}
                </span>
              </div>
            </article>
          ))}
        </div>

        <div className="hidden overflow-x-auto sm:block">
          <table className="w-full border-collapse font-sans text-[0.84rem]">
            <thead>
              <tr className="bg-[#fbf5eb] text-left text-[0.64rem] uppercase tracking-[0.14em] text-[#7a6b63]">
                <th className="px-4 py-3 font-medium">Sort</th>
                <th className="px-4 py-3 font-medium">Koleksi</th>
                <th className="px-4 py-3 font-medium">Kategori</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Foto</th>
              </tr>
            </thead>
            <tbody>
              {recentItems.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-[rgba(44,36,32,0.06)] text-[#2c2420]"
                >
                  <td className="px-4 py-4 font-serif-display text-[1rem]">{item.sortOrder}</td>
                  <td className="px-4 py-4">
                    <div className="font-medium">{item.name}</div>
                    <div className="mt-1 text-[0.74rem] text-[#7a6b63]">{item.id}</div>
                  </td>
                  <td className="px-4 py-4 text-[#7a6b63]">{item.category}</td>
                  <td className="px-4 py-4">
                    <span
                      className={classNames(
                        "inline-flex rounded-full px-2.5 py-1 text-[0.68rem] uppercase tracking-[0.12em]",
                        item.isActive
                          ? "bg-[#eaf3de] text-[#3b6d11]"
                          : "bg-[#eeedfe] text-[#534ab7]",
                      )}
                    >
                      {item.isActive ? "Tampil" : "Disembunyikan"}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-[#7a6b63]">{item.images.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
