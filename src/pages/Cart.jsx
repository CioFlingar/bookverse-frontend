import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import ErrorAlert from "../components/ErrorAlert";
import LoadingSpinner from "../components/LoadingSpinner";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(amount) || 0);

export default function Cart() {
  const navigate = useNavigate();
  const {
    items,
    loading,
    error,
    clearError,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalQuantity,
  } = useCart();
  const { isAuthenticated } = useAuth();
  const [busyAction, setBusyAction] = useState("");

  const subtotal = getTotalPrice();
  const totalQuantity = getTotalQuantity();
  const total = useMemo(() => subtotal, [subtotal]);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    navigate("/checkout");
  };

  const runCartAction = async (actionId, action) => {
    setBusyAction(actionId);
    try {
      await action();
    } catch {
      // CartContext surfaces the message through its shared error state.
    } finally {
      setBusyAction("");
    }
  };

  return (
    <div className="font-serif bg-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-4xl font-serif font-bold text-slate-900">Shopping Cart</h1>
            <p className="text-sm text-slate-500 mt-2">
              {totalQuantity > 0
                ? `${totalQuantity} ${totalQuantity === 1 ? "item" : "items"} ready for checkout`
                : "Build your next reading stack"}
            </p>
          </div>
          {items.length > 0 && (
            <Button
              variant="tertiary"
              onClick={() => runCartAction("clear", clearCart)}
              loading={busyAction === "clear"}
              disabled={loading || Boolean(busyAction)}
            >
              Clear Cart
            </Button>
          )}
        </div>

        {error && (
          <ErrorAlert message={error} onClose={clearError} className="mb-6" />
        )}

        {loading ? (
          <div className="py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 border border-slate-200 rounded-lg">
            <ShoppingBag className="mx-auto mb-4 text-slate-300" size={44} />
            <p className="text-slate-700 font-semibold mb-2">Your cart is empty</p>
            <p className="text-sm text-slate-500 mb-6">Find a book you love and bring it back here.</p>
            <Button variant="primary" onClick={() => navigate("/catalog")}>
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => {
                const price = Number(item.price) || 0;
                const quantity = Number(item.quantity) || 1;
                const stock = Number(item.stock);
                const hasStockLimit = Number.isFinite(stock);
                const isAtStockLimit = hasStockLimit && quantity >= stock;
                const isBusy = busyAction.endsWith(`:${item._id}`);

                return (
                  <div
                    key={item._id}
                    className="grid grid-cols-[72px_1fr] gap-4 rounded-lg border border-slate-200 p-4 transition hover:shadow-md sm:grid-cols-[96px_1fr_auto] sm:gap-6 sm:p-6"
                  >
                    <img
                      src={item.image || "https://via.placeholder.com/100x150?text=No+Image"}
                      alt={`${item.title} cover`}
                      className="h-28 w-[72px] rounded object-cover bg-slate-100 sm:h-32 sm:w-24"
                    />

                    <div className="min-w-0">
                      <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-600 mb-2">{item.author}</p>
                      <p className="text-lg font-bold text-slate-900">
                        {formatCurrency(price)}
                      </p>
                      {hasStockLimit && (
                        <p className="mt-1 text-xs text-slate-500">
                          {stock > 0 ? `${stock} in stock` : "Out of stock"}
                        </p>
                      )}
                    </div>

                    <div className="col-span-2 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-4 sm:col-span-1 sm:flex-col sm:items-end sm:border-t-0 sm:pt-0">
                      <div className="flex items-center overflow-hidden rounded border border-slate-300">
                        <button
                          onClick={() =>
                            runCartAction(`decrement:${item._id}`, () =>
                              updateQuantity(item._id, quantity - 1),
                            )
                          }
                          disabled={isBusy || Boolean(busyAction)}
                          className="flex h-9 w-9 items-center justify-center hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300"
                          aria-label={`Decrease quantity for ${item.title}`}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="flex h-9 min-w-10 items-center justify-center px-3 text-sm font-semibold">
                          {quantity}
                        </span>
                        <button
                          onClick={() =>
                            runCartAction(`increment:${item._id}`, () =>
                              updateQuantity(item._id, quantity + 1),
                            )
                          }
                          disabled={isBusy || Boolean(busyAction) || isAtStockLimit}
                          className="flex h-9 w-9 items-center justify-center hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300"
                          aria-label={`Increase quantity for ${item.title}`}
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-slate-500">Subtotal</p>
                        <p className="text-lg font-bold text-slate-900">
                          {formatCurrency(price * quantity)}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          runCartAction(`remove:${item._id}`, () => removeItem(item._id))
                        }
                        disabled={isBusy || Boolean(busyAction)}
                        className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800 disabled:cursor-not-allowed disabled:text-red-300"
                      >
                        <Trash2 size={16} />
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="h-fit rounded-lg border border-slate-200 p-6 lg:sticky lg:top-24">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h3>
              
              <div className="space-y-3 mb-6 border-b border-slate-200 pb-6">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({totalQuantity} items):</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping:</span>
                  <span>Free</span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-bold text-slate-900 mb-6">
                <span>Total:</span>
                <span>{formatCurrency(total)}</span>
              </div>

              <Button
                variant="primary"
                size="lg"
                onClick={handleCheckout}
                className="w-full"
                disabled={Boolean(busyAction)}
              >
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
