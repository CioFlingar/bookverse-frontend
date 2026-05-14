import { useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import ErrorAlert from "../components/ErrorAlert";
import { useAuth } from "../hooks/useAuth";
import { authService } from "../services/authService";

const strengthStyles = {
  weak: {
    label: "Weak",
    bar: "w-1/3 bg-red-500",
    badge: "bg-red-50 text-red-700 ring-red-200",
    hint: "Use at least 6 characters.",
  },
  medium: {
    label: "Medium",
    bar: "w-2/3 bg-amber-500",
    badge: "bg-amber-50 text-amber-700 ring-amber-200",
    hint: "Add uppercase letters and numbers for a stronger password.",
  },
  strong: {
    label: "Strong",
    bar: "w-full bg-emerald-600",
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    hint: "Nice. This password is ready to use.",
  },
};

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const checkPasswordStrength = (pwd) => {
    if (pwd.length < 6) return "weak";
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) return "strong";
    return "medium";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "password") {
      setPasswordStrength(value ? checkPasswordStrength(value) : "");
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

  const strength = passwordStrength ? strengthStyles[passwordStrength] : null;
  const passwordsMatch =
    formData.confirmPassword && formData.password === formData.confirmPassword;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[1.05fr_0.95fr]">
        <section className="flex items-center justify-center px-4 py-8 sm:px-6 lg:px-10">
          <div className="w-full max-w-md">
            <div className="mb-8 flex items-center justify-between lg:hidden">
              <Link to="/" className="flex items-center gap-2 text-slate-950">
                <span className="grid h-10 w-10 place-items-center rounded-md bg-slate-900 text-white shadow-sm">
                  <BookOpen className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-serif text-2xl font-bold italic leading-none">
                    BookVerse
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                    Curated bookstore
                  </span>
                </span>
              </Link>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-8">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-700">
                  Start your shelf
                </p>
                <h1 className="font-serif text-3xl font-bold text-slate-950">
                  Create your BookVerse account
                </h1>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Save favorites, track orders, and build a personal reading
                  space in a few quick details.
                </p>
              </div>

              <form onSubmit={handleRegister} className="space-y-5">
                <ErrorAlert message={error} onClose={() => setError("")} />

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Full name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      disabled={loading}
                      required
                      autoComplete="name"
                      className="h-11 w-full rounded-md border border-slate-300 bg-white pl-10 pr-3 text-sm text-slate-900 transition placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 disabled:bg-slate-100 disabled:opacity-70"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="reader@bookverse.com"
                      disabled={loading}
                      required
                      autoComplete="email"
                      className="h-11 w-full rounded-md border border-slate-300 bg-white pl-10 pr-3 text-sm text-slate-900 transition placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 disabled:bg-slate-100 disabled:opacity-70"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                      disabled={loading}
                      required
                      autoComplete="new-password"
                      className="h-11 w-full rounded-md border border-slate-300 bg-white pl-10 pr-11 text-sm text-slate-900 transition placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 disabled:bg-slate-100 disabled:opacity-70"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {strength && (
                    <div className="rounded-md bg-slate-50 p-3">
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <span className="text-xs text-slate-500">
                          Password strength
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-bold ring-1 ${strength.badge}`}
                        >
                          {strength.label}
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className={`h-full rounded-full transition-all ${strength.bar}`}
                        />
                      </div>
                      <p className="mt-2 text-xs leading-5 text-slate-500">
                        {strength.hint}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="confirmPassword"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Confirm password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Repeat your password"
                      disabled={loading}
                      required
                      autoComplete="new-password"
                      className="h-11 w-full rounded-md border border-slate-300 bg-white pl-10 pr-11 text-sm text-slate-900 transition placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 disabled:bg-slate-100 disabled:opacity-70"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword((current) => !current)
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {passwordsMatch && (
                    <p className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Passwords match
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  loading={loading}
                  disabled={loading}
                  size="lg"
                  className="w-full"
                >
                  {loading ? "Creating account" : "Create account"}
                </Button>
              </form>

              <div className="mt-6 border-t border-slate-100 pt-5 text-center text-sm text-slate-600">
                <span>Already have an account? </span>
                <Link
                  to="/login"
                  className="font-bold text-slate-900 underline-offset-4 hover:underline"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="hidden border-l border-slate-200 bg-white px-10 py-10 lg:flex lg:flex-col">
          <Link
            to="/"
            className="inline-flex w-fit items-center gap-2 rounded-md text-sm font-semibold text-slate-600 transition-colors hover:text-slate-950"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to store
          </Link>

          <div className="my-auto max-w-md">
            <div className="mb-8 flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-md bg-slate-900 text-white shadow-sm">
                <BookOpen className="h-6 w-6" />
              </span>
              <div>
                <h2 className="font-serif text-4xl font-bold italic leading-none">
                  BookVerse
                </h2>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.22em] text-amber-700">
                  Curated bookstore
                </p>
              </div>
            </div>

            <h3 className="font-serif text-5xl font-bold leading-tight text-slate-950">
              Build a home for every book you love.
            </h3>
            <p className="mt-5 text-base leading-7 text-slate-600">
              Your account keeps wishlists, checkout details, and order history
              together so the next great read is always easy to find.
            </p>

            <div className="mt-10 grid gap-4 border-t border-slate-200 pt-6">
              {[
                "Save titles for later",
                "Checkout with fewer steps",
                "Track your BookVerse orders",
              ].map((item) => (
                <p
                  key={item}
                  className="flex items-center gap-3 text-sm font-medium text-slate-700"
                >
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  {item}
                </p>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
