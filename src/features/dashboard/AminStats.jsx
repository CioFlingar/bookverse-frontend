// src/features/dashboard/AdminStats.jsx
export default function AdminStats({ stats }) {
  const metrics = [
    { label: "Total Revenue", value: `$${stats.totalRevenue.toLocaleString()}` },
    { label: "Catalog Size", value: `${stats.totalBooks} Titles` },
    { label: "Delivered Orders", value: stats.activeReaders },
    { label: "Inventory Value", value: `$${stats.inventoryValue.toLocaleString()}` }
  ];

  return (
    <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
      {metrics.map((m, i) => (
        <div
          key={i}
          className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
        >
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
            {m.label}
          </p>
          <p className="mt-2 font-serif text-2xl font-bold text-slate-950">
            {m.value}
          </p>
        </div>
      ))}
    </div>
  );
}
