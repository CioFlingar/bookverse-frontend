import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { authService } from "../services/authService";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
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
    <div className="font-serif bg-gray-50">
      <div className="text-center flex flex-col  min-h-screen justify-center items-center p-4 relative">
        <div className="text-center mb-4">
          <h2 className="text-3xl italic text-slate-800">BookVerse</h2>
          <p className="uppercase tracking-[0.3em] text-[10px] text-slate-500 mt-1">
            curated for the bibliophile
          </p>
        </div>

        <div className="bg-white border border-slate-200 w-full max-w-md py-8 px-12 md:p-10 shadow-sm">
          <div className="text-left mb-8">
            <h3 className="text-xl text-slate-800 mb-2">Welcome Back</h3>
            <p className="text-slate-500 text-sm mb-2">
              Please enter your details to access your collection.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                {error}
              </div>
            )}

            <div className="flex flex-col">
              <label
                htmlFor="email"
                className="text-left uppercase text-[14px] font-bold tracking-wider text-slate-700"
              >
                email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                placeholder="e.g. reader@bookverse.com"
                disabled={loading}
                required
                className="border-b border-slate-300 py-2 focus:outline-none focus:border-slate-900 transition-colors
                             placeholder:text-slate-300 text-sm disabled:opacity-50"
              />
            </div>

            <div className="flex flex-col">
              <div className="flex justify-between items-end">
                <label
                  htmlFor="password"
                  className="text-left uppercase text-[14px] font-bold tracking-wider text-slate-700"
                >
                  password
                </label>
                <a
                  href="#"
                  className="text-[14px] text-red-400 hover:text-red-600 transition-colors"
                >
                  Forgot Password?
                </a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                placeholder="........"
                disabled={loading}
                required
                className="border-b border-slate-300 py-1 focus:outline-none focus:border-slate-900 transition-colors
                             placeholder:text-slate-300 text-[25px] disabled:opacity-50"
              />
            </div>

            <div className="flex items-center space-x-1 py-1">
              <input
                type="checkbox"
                id="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 border-slate-300 rounded accent-slate-900"
                disabled={loading}
              />
              <label htmlFor="checkbox" className="text-[14px] text-slate-600">
                Remember me for 30 days
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-3 text-[15px] tracking-[0.2em] font-semibold
                         hover:bg-slate-800 disabled:bg-slate-400 cursor-pointer transition-all mt-3"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-slate-600 border-t border-slate-100 pt-2">
            <span>Don't have an account?</span>
            <Link
              to="/register"
              className="font-bold text-slate-900 hover:underline"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
