import StatusBadge from "../../components/StatusBadge";

const orderStatuses = ["Processing", "In Transit", "Delivered"];

const getOrderItems = (order) =>
  order.items
    ?.map((item) => {
      const title = item.book?.title || "Unknown book";
      return `${title} x${item.quantity}`;
    })
    .join(", ") || "No items";

export default function AdminOrdersTable({
  orders = [],
  loading = false,
  totalOrders = 0,
  statusFilter = "",
  onStatusFilterChange,
  onStatusChange,
}) {
  return (
    <div className="mt-12 bg-white border border-gray-100 p-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h3 className="text-xl font-serif">Customer Orders</h3>
          <p className="text-xs uppercase tracking-widest text-gray-400 mt-1">
            {totalOrders} orders placed
          </p>
        </div>
        <select
          value={statusFilter}
          onChange={(event) => onStatusFilterChange(event.target.value)}
          className="border border-gray-200 px-3 py-2 text-xs uppercase tracking-widest font-bold focus:outline-none focus:ring-1 focus:ring-slate-900"
        >
          <option value="">All Statuses</option>
          {orderStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] uppercase text-gray-400 border-b border-gray-100">
              <th className="pb-4">Customer</th>
              <th className="pb-4">Items</th>
              <th className="pb-4">Date</th>
              <th className="pb-4">Status</th>
              <th className="pb-4 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-sm text-gray-400">
                  Loading orders...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-sm text-gray-400">
                  No customer orders yet.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id} className="border-b border-gray-50 last:border-0 align-top">
                  <td className="py-4">
                    <p className="font-medium">{order.user?.name || "Unknown customer"}</p>
                    <p className="text-xs text-gray-400">{order.user?.email || "No email"}</p>
                  </td>
                  <td className="py-4 max-w-sm text-sm text-gray-600">
                    {getOrderItems(order)}
                  </td>
                  <td className="py-4 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4">
                    <div className="flex flex-col gap-2">
                      <StatusBadge label={order.status} />
                      <select
                        value={order.status}
                        onChange={(event) => onStatusChange(order._id, event.target.value)}
                        className="border border-gray-200 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-slate-900"
                      >
                        {orderStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td className="py-4 text-right text-sm font-semibold text-verse-dark">
                    ${Number(order.totalPrice || 0).toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
