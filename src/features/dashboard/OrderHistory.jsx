// src/features/dashboard/OrderHistory.jsx
export default function OrderHistory() {
  const orders = [
    { id: '1', item: 'Klara and the Sun', date: 'Oct 24, 2024', status: 'DELIVERED', price: 45.00 }, // [cite: 148, 167, 168]
    { id: '2', item: 'Norwegian Wood', date: 'Oct 28, 2024', status: 'IN TRANSIT', price: 28.00 }, // [cite: 149, 169, 170]
    { id: '3', item: 'Design as Art', date: 'Nov 01, 2024', status: 'PROCESSING', price: 55.00 }, // [cite: 151, 171, 172]
  ];

  return (
    <div className="mt-12">
      <h3 className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-6 pb-2 border-b">Recent Orders [cite: 146]</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-[10px] uppercase tracking-widest text-gray-400 border-b border-gray-100">
              <th className="pb-4 font-bold">Item [cite: 147]</th>
              <th className="pb-4 font-bold">Date [cite: 153]</th>
              <th className="pb-4 font-bold">Status [cite: 165]</th>
              <th className="pb-4 font-bold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map((order) => (
              <tr key={order.id} className="group">
                <td className="py-4 font-medium text-verse-dark">{order.item}</td>
                <td className="py-4 text-gray-500">{order.date}</td>
                <td className="py-4">
                  <span className={`text-[10px] font-bold px-2 py-1 ${
                    order.status === 'DELIVERED' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="py-4 text-right">
                  <button className="text-[10px] uppercase font-bold text-gray-400 hover:text-verse-dark">Details [cite: 211]</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}