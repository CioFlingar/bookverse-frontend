import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import { CheckCircle } from "lucide-react";

export default function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  if (!order) {
    return (
      <div className="font-serif bg-white">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-12 text-center">
          <p className="text-slate-600 mb-6">Order not found</p>
          <Button variant="primary" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="font-serif bg-white">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <CheckCircle size={64} className="text-green-600" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-slate-900 mb-4">
            Order Confirmed!
          </h1>
          <p className="text-slate-600 mb-2">Thank you for your purchase</p>
          <p className="text-sm text-slate-500">
            A confirmation email has been sent to your inbox
          </p>
        </div>

        {/* Order Details */}
        <div className="border border-slate-200 rounded-lg p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <p className="text-slate-600 text-sm mb-1">Order Number</p>
              <p className="text-2xl font-bold text-slate-900">{order._id}</p>
            </div>
            <div>
              <p className="text-slate-600 text-sm mb-1">Order Date</p>
              <p className="text-lg font-semibold text-slate-900">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-slate-600 text-sm mb-1">Status</p>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                <p className="font-semibold text-slate-900">{order.status}</p>
              </div>
            </div>
            <div>
              <p className="text-slate-600 text-sm mb-1">Order Total</p>
              <p className="text-2xl font-bold text-slate-900">\${order.totalAmount?.toFixed(2) || "0.00"}</p>
            </div>
          </div>

          {/* Items */}
          <div className="border-t border-slate-200 pt-8">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Items Ordered</h3>
            <div className="space-y-4">
              {order.items?.map((item) => (
                <div key={item._id} className="flex justify-between items-center py-2 border-b border-slate-100">
                  <div>
                    <p className="font-semibold text-slate-900">{item.bookId?.title || "Book"}</p>
                    <p className="text-sm text-slate-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-slate-900">\${(item.price * item.quantity)?.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <div className="border-t border-slate-200 pt-8 mt-8">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Shipping Address</h3>
              <div className="text-slate-700">
                <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                <p>{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                <p>{order.shippingAddress.country}</p>
                <p className="mt-2 text-sm">{order.shippingAddress.email}</p>
              </div>
            </div>
          )}
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="font-bold text-slate-900 mb-3">What's Next?</h3>
          <ul className="text-sm text-slate-700 space-y-2 list-disc list-inside">
            <li>Your order is being processed and will be shipped soon</li>
            <li>You'll receive a shipping confirmation email with tracking info</li>
            <li>Visit your dashboard to track your order status</li>
            <li>You can now leave reviews for your books</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button variant="primary" onClick={() => navigate("/dashboard")}>
            View Dashboard
          </Button>
          <Button variant="secondary" onClick={() => navigate("/catalog")}>
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}
