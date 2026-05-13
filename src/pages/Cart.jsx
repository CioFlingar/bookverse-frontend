import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { Trash2 } from "lucide-react";

export default function Cart() {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalQuantity } = useCart();
  const { isAuthenticated } = useAuth();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    navigate("/checkout");
  };

  return (
    <div className="font-serif bg-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-serif font-bold text-slate-900 mb-12">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 mb-6">Your cart is empty</p>
            <Button variant="primary" onClick={() => navigate("/catalog")}>
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="md:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="flex gap-6 p-6 border border-slate-200 rounded-lg hover:shadow-md transition"
                >
                  {/* Image */}
                  <img
                    src={item.image || "https://via.placeholder.com/100x150"}
                    alt={item.title}
                    className="w-24 h-32 object-cover rounded"
                  />

                  {/* Details */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                    <p className="text-slate-600 mb-2">{item.author}</p>
                    <p className="text-2xl font-bold text-slate-900">\${item.price}</p>
                  </div>

                  {/* Quantity */}
                  <div className="flex flex-col items-center justify-between">
                    <div className="flex items-center gap-2 border border-slate-300 rounded">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="px-3 py-1 hover:bg-slate-100"
                      >
                        −
                      </button>
                      <span className="px-3 py-1 font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="px-3 py-1 hover:bg-slate-100"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item._id)}
                      className="mt-2 text-red-600 hover:text-red-800 flex items-center gap-1"
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right">
                    <p className="text-sm text-slate-600">Subtotal</p>
                    <p className="text-lg font-bold text-slate-900">\${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="h-fit p-6 border border-slate-200 rounded-lg sticky top-20">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h3>
              
              <div className="space-y-3 mb-6 border-b border-slate-200 pb-6">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({getTotalQuantity()} items):</span>
                  <span>\${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping:</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tax:</span>
                  <span>\${(getTotalPrice() * 0.08).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-bold text-slate-900 mb-6">
                <span>Total:</span>
                <span>\${(getTotalPrice() * 1.08).toFixed(2)}</span>
              </div>

              <Button variant="primary" size="lg" onClick={handleCheckout} className="w-full">
                Proceed to Checkout
              </Button>

              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate("/catalog")}
                className="w-full mt-3"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
