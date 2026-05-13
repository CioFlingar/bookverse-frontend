import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ErrorAlert from "../components/ErrorAlert";
import { useAuth } from "../hooks/useAuth";
import { authService } from "../services/authService";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");

  const checkPasswordStrength = (pwd) => {
    if (pwd.length < 6) return "weak";
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) return "strong";
    return "medium";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "password") {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const userData = await authService.register(
        formData.name,
        formData.email,
        formData.password,
      );
      login(userData);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-serif bg-gray-50">
      <div className="text-center flex flex-col min-h-screen justify-center items-center p-4">
        <div className="text-center mb-4">
          <h2 className="text-3xl italic text-slate-800">BookVerse</h2>
          <p className="uppercase tracking-[0.3em] text-[10px] text-slate-500 mt-1">
            curated for the bibliophile
          </p>
        </div>

        <div className="bg-white border border-slate-200 w-full max-w-md py-8 px-12 md:p-10 shadow-sm">
          <div className="text-left mb-8">
            <h3 className="text-xl text-slate-800 mb-2">Create Account</h3>
            <p className="text-slate-500 text-sm mb-2">
              Join BookVerse to start building your library.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            {error && <ErrorAlert message={error} onClose={() => setError("")} />}

            <div className="flex flex-col">
              <label className="text-left uppercase text-[14px] font-bold tracking-wider text-slate-700">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                disabled={loading}
                required
                className="border-b border-slate-300 py-2 focus:outline-none focus:border-slate-900 transition-colors placeholder:text-slate-300 text-sm disabled:opacity-50"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-left uppercase text-[14px] font-bold tracking-wider text-slate-700">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="reader@bookverse.com"
                disabled={loading}
                required
                className="border-b border-slate-300 py-2 focus:outline-none focus:border-slate-900 transition-colors placeholder:text-slate-300 text-sm disabled:opacity-50"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-left uppercase text-[14px] font-bold tracking-wider text-slate-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="........"
                disabled={loading}
                required
                className="border-b border-slate-300 py-2 focus:outline-none focus:border-slate-900 transition-colors placeholder:text-slate-300 text-sm disabled:opacity-50"
              />
              {formData.password && (
                <div className="mt-1 flex items-center gap-2">
                  <div className={`text-xs font-semibold px-2 py-1 rounded ${
                    passwordStrength === "weak" ? "bg-red-100 text-red-700" :
                    passwordStrength === "medium" ? "bg-yellow-100 text-yellow-700" :
                    "bg-green-100 text-green-700"
                  }`}>
                    {passwordStrength === "weak" ? "Weak" : passwordStrength === "medium" ? "Medium" : "Strong"}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-left uppercase text-[14px] font-bold tracking-wider text-slate-700">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="........"
                disabled={loading}
                required
                className="border-b border-slate-300 py-2 focus:outline-none focus:border-slate-900 transition-colors placeholder:text-slate-300 text-sm disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-3 text-[15px] tracking-[0.2em] font-semibold hover:bg-slate-800 disabled:bg-slate-400 cursor-pointer transition-all mt-3"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-slate-600 border-t border-slate-100 pt-2">
            <span>Already have an account?</span>
            <Link to="/login" className="font-bold text-slate-900 hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
