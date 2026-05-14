// src/features/dashboard/OrderHistory.jsx
import { useEffect, useState } from "react";
import StatusBadge from "../../components/StatusBadge";
import { orderService } from "../../services/orderService";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getUserOrders();
        setOrders(data.slice(0, 5));
      } catch (err) {
        console.error("Failed to load orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getOrderTitle = (order) =>
    order.items
      ?.map((item) => item.book?.title)
      .filter(Boolean)
      .join(", ") || "Book order";

  return (
    <div className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6">
        <h3 className="font-serif text-2xl font-bold text-slate-950">
          Recent Orders
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Your latest BookVerse purchases and delivery status.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-xs uppercase tracking-[0.16em] text-slate-400">
              <th className="pb-4 font-bold">Item</th>
              <th className="pb-4 font-bold">Date</th>
              <th className="pb-4 font-bold">Status</th>
              <th className="pb-4 font-bold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading && (
              <tr>
                <td className="py-6 text-slate-500" colSpan="4">
                  Loading orders...
                </td>
              </tr>
            )}
            {!loading && orders.length === 0 && (
              <tr>
                <td className="py-6 text-slate-500" colSpan="4">
                  No recent orders yet.
                </td>
              </tr>
            )}
            {!loading &&
              orders.map((order) => (
                <tr key={order._id} className="group">
                  <td className="py-4 font-semibold text-slate-900">
                    {getOrderTitle(order)}
                  </td>
                  <td className="py-4 text-slate-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4">
                    <StatusBadge label={order.status} className="rounded" />
                  </td>
                  <td className="py-4 text-right text-sm font-semibold text-slate-950">
                    ${order.totalPrice?.toFixed(2) || "0.00"}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
