import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Input from "../components/Input";
import Button from "../components/Button";
import ErrorAlert from "../components/ErrorAlert";
import { useCart } from "../hooks/useCart";
import { orderService } from "../services/orderService";

export default function Checkout() {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.firstName ||
      !formData.email ||
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.zipCode
    ) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const response = await orderService.createOrder({
        street: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
      });

      await clearCart().catch(() => {});
      navigate("/order-confirmation", { state: { order: response } });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="font-serif bg-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <p className="text-slate-600 mb-6">Your cart is empty</p>
          <Button variant="primary" onClick={() => navigate("/catalog")}>
            Back to Catalog
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="font-serif bg-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-serif font-bold text-slate-900 mb-12">Checkout</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <form onSubmit={handleSubmit} className="md:col-span-2 space-y-6">
            {error && <ErrorAlert message={error} onClose={() => setError("")} />}

            {/* Shipping Address */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Shipping Address</h2>
              <div className="grid md:grid-cols-2 gap-4 space-y-4 md:space-y-0">
                <Input
                  label="First Name"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Last Name"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="md:col-span-2"
                />
                <Input
                  label="Phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
                <Input
                  label="Address"
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="md:col-span-2"
                />
                <Input
                  label="City"
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="State"
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="ZIP Code"
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Country"
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                />
              </div>
            </div>

            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
              Place Order
            </Button>
          </form>

          {/* Order Summary */}
          <div className="h-fit p-6 border border-slate-200 rounded-lg sticky top-20">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h3>
            
            <div className="space-y-3 mb-6 border-b border-slate-200 pb-6">
              {items.map((item) => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span className="text-slate-600">{item.title}</span>
                  <span className="font-semibold">\${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span>\${getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-slate-900 border-t border-slate-200 pt-3">
                <span>Total:</span>
                <span>\${getTotalPrice().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
