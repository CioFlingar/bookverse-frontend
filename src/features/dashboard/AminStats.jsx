// src/features/dashboard/AdminStats.jsx
export default function AdminStats({ stats }) {
  const metrics = [
    { label: "Total Revenue", value: `$${stats.totalRevenue.toLocaleString()}` },
    { label: "Catalog Size", value: `${stats.totalBooks} Titles` },
    { label: "Delivered Orders", value: stats.activeReaders },
    { label: "Inventory Value", value: `$${stats.inventoryValue.toLocaleString()}` }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
      {metrics.map((m, i) => (
        <div key={i} className="border border-gray-200 p-6 bg-white">
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-2">
            {m.label}
          </p>
          <p className="text-2xl font-serif text-verse-dark">
            {m.value}
          </p>
        </div>
      ))}
    </div>
  );
}
