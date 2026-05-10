// src/features/dashboard/InventoryTable.jsx
export default function InventoryTable() {
  const inventory = [
    { title: "The Silent Margin", author: "Elias Vance", stock: 24, price: 28.00 },
    { title: "Whispers of the Ink", author: "Clara Thorne", stock: 3, price: 32.50 },
    { title: "Architectural Verse", author: "Julian Moretti", stock: 82, price: 45.00 },
  ];

  return (
    <div className="mt-12 bg-white border border-gray-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-serif">Manage Catalog</h3>
        <button className="bg-verse-dark text-white px-4 py-2 text-[10px] uppercase tracking-widest font-bold">
          + Add New Book
        </button>
      </div>
      <table className="w-full text-left">
        <thead>
          <tr className="text-[10px] uppercase text-gray-400 border-b border-gray-100">
            <th className="pb-4">Book Title</th>
            <th className="pb-4">Stock</th>
            <th className="pb-4">Price</th>
            <th className="pb-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item, i) => (
            <tr key={i} className="border-b border-gray-50 last:border-0">
              <td className="py-4 font-medium">{item.title}</td>
              <td className="py-4">
                <span className={`text-[10px] font-bold ${item.stock < 5 ? 'text-red-500' : 'text-gray-500'}`}>
                  {item.stock < 5 ? `Low Stock (${item.stock})` : `${item.stock} in stock`}
                </span>
              </td>
              <td className="py-4 text-sm">${item.price.toFixed(2)}</td>
              <td className="py-4 text-right text-[10px] uppercase font-bold text-gray-400 underline cursor-pointer">
                Edit
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}