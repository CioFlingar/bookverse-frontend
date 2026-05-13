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
    <div className="mt-12">
      <h3 className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-6 pb-2 border-b">Recent Orders</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-[10px] uppercase tracking-widest text-gray-400 border-b border-gray-100">
              <th className="pb-4 font-bold">Item</th>
              <th className="pb-4 font-bold">Date</th>
              <th className="pb-4 font-bold">Status</th>
              <th className="pb-4 font-bold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading && (
              <tr>
                <td className="py-6 text-gray-500" colSpan="4">
                  Loading orders...
                </td>
              </tr>
            )}
            {!loading && orders.length === 0 && (
              <tr>
                <td className="py-6 text-gray-500" colSpan="4">
                  No recent orders yet.
                </td>
              </tr>
            )}
            {!loading &&
              orders.map((order) => (
                <tr key={order._id} className="group">
                  <td className="py-4 font-medium text-verse-dark">
                    {getOrderTitle(order)}
                  </td>
                  <td className="py-4 text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4">
                    <StatusBadge label={order.status} className="rounded" />
                  </td>
                  <td className="py-4 text-right text-sm font-semibold text-verse-dark">
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
