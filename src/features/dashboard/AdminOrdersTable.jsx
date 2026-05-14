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
    <div className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h3 className="font-serif text-2xl font-bold text-slate-950">
            Customer Orders
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {totalOrders} orders placed
          </p>
        </div>
        <select
          value={statusFilter}
          onChange={(event) => onStatusFilterChange(event.target.value)}
          className="h-10 rounded-md border border-slate-200 px-3 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
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
            <tr className="border-b border-slate-100 text-xs uppercase tracking-[0.16em] text-slate-400">
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
                <td colSpan="5" className="py-8 text-center text-sm text-slate-400">
                  Loading orders...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-sm text-slate-400">
                  No customer orders yet.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id} className="border-b border-slate-50 align-top last:border-0">
                  <td className="py-4">
                    <p className="font-semibold text-slate-900">{order.user?.name || "Unknown customer"}</p>
                    <p className="text-xs text-slate-400">{order.user?.email || "No email"}</p>
                  </td>
                  <td className="max-w-sm py-4 text-sm text-slate-600">
                    {getOrderItems(order)}
                  </td>
                  <td className="py-4 text-sm text-slate-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4">
                    <div className="flex flex-col gap-2">
                      <StatusBadge label={order.status} />
                      <select
                        value={order.status}
                        onChange={(event) => onStatusChange(order._id, event.target.value)}
                        className="rounded-md border border-slate-200 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                      >
                        {orderStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td className="py-4 text-right text-sm font-semibold text-slate-950">
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
