import { useState } from "react";
import { ArrowLeft, BookOpen, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import ErrorAlert from "../components/ErrorAlert";
import { useAuth } from "../hooks/useAuth";
import { authService } from "../services/authService";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true);
    try {
      const userData = await authService.login(email, password, rememberMe);
      login(userData);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[0.95fr_1.05fr]">
        <section className="hidden border-r border-slate-200 bg-white px-10 py-10 lg:flex lg:flex-col">
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
                <h1 className="font-serif text-4xl font-bold italic leading-none">
                  BookVerse
                </h1>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.22em] text-amber-700">
                  Curated bookstore
                </p>
              </div>
            </div>

            <h2 className="font-serif text-5xl font-bold leading-tight text-slate-950">
              Pick up where your shelf left off.
            </h2>
            <p className="mt-5 text-base leading-7 text-slate-600">
              Sign in to manage your orders, revisit saved books, and continue
              building a collection that feels like yours.
            </p>

            <div className="mt-10 grid gap-3 border-t border-slate-200 pt-6 text-sm text-slate-600">
              <p className="flex items-center justify-between">
                <span>Saved wishlist</span>
                <span className="font-semibold text-slate-900">Ready</span>
              </p>
              <p className="flex items-center justify-between">
                <span>Order history</span>
                <span className="font-semibold text-slate-900">Synced</span>
              </p>
              <p className="flex items-center justify-between">
                <span>Reader dashboard</span>
                <span className="font-semibold text-slate-900">Secure</span>
              </p>
            </div>
          </div>
        </section>

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
                  Welcome back
                </p>
                <h2 className="font-serif text-3xl font-bold text-slate-950">
                  Sign in to BookVerse
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Access your library dashboard, checkout faster, and keep your
                  favorite titles close.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <ErrorAlert message={error} onClose={() => setError("")} />

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
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      id="email"
                      placeholder="reader@bookverse.com"
                      disabled={loading}
                      required
                      autoComplete="email"
                      className="h-11 w-full rounded-md border border-slate-300 bg-white pl-10 pr-3 text-sm text-slate-900 transition placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 disabled:bg-slate-100 disabled:opacity-70"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-3">
                    <label
                      htmlFor="password"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setError(
                          "Password reset is not available yet. Please contact support if you need help signing in.",
                        )
                      }
                      className="text-xs font-semibold text-slate-500 transition-colors hover:text-slate-950"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      id="password"
                      placeholder="Enter your password"
                      disabled={loading}
                      required
                      autoComplete="current-password"
                      className="h-11 w-full rounded-md border border-slate-300 bg-white pl-10 pr-11 text-sm text-slate-900 transition placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 disabled:bg-slate-100 disabled:opacity-70"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute right-2 top-1/2 rounded-md p-2 -translate-y-1/2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
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
                </div>

                <div className="flex items-start gap-2 rounded-md bg-slate-50 p-3">
                  <input
                    type="checkbox"
                    id="remember-me"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-slate-900"
                    disabled={loading}
                  />
                  <label
                    htmlFor="remember-me"
                    className="text-sm leading-5 text-slate-600"
                  >
                    Keep me signed in for faster checkout on this device.
                  </label>
                </div>

                <Button
                  type="submit"
                  loading={loading}
                  disabled={loading}
                  size="lg"
                  className="w-full"
                >
                  {loading ? "Signing in" : "Sign in"}
                </Button>
              </form>

              <div className="mt-6 border-t border-slate-100 pt-5 text-center text-sm text-slate-600">
                <span>New to BookVerse? </span>
                <Link
                  to="/register"
                  className="font-bold text-slate-900 underline-offset-4 hover:underline"
                >
                  Create an account
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
