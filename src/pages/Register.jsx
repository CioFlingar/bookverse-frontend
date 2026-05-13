// src/pages/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../api/client";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.post("/auth/register", {
        name,
        email,
        password,
      });
      localStorage.setItem("userInfo", JSON.stringify(res.data));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-serif bg-gray-50">
      <div className="text-center flex flex-col  min-h-screen justify-center items-center p-4 relative">
        <div className="text-center mb-4">
          <h2 className="text-2xl italic text-slate-800">BookVerse</h2>
          <p className="uppercase tracking-[0.3em] text-[10px] text-slate-500 mt-1">
            curated for the bibliophile
          </p>
        </div>

        <div className="bg-white border border-slate-200 w-full max-w-md py-8 px-12 md:p-10 shadow-sm">
          <div className="text-left mb-6">
            <h3 className="text-2xl text-slate-800 mb-2">Join the Verse</h3>
            <p className="text-slate-500 text-sm mb-2">
              Start your curated literary journey today.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                {error}
              </div>
            )}

            <div className="flex flex-col">
              <label
                htmlFor="name"
                className="text-left uppercase text-[14px] font-bold tracking-wider text-slate-700 mb-1"
              >
                full name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Doe"
                disabled={loading}
                required
                className="border-b border-slate-300 py-2 focus:outline-none focus:border-slate-900 transition-colors placeholder:text-slate-300 text-sm disabled:opacity-50"
              />
            </div>

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
              <label
                htmlFor="password"
                className="text-left uppercase text-[14px] font-bold tracking-wider text-slate-700"
              >
                password
              </label>
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

            <div className="flex items-center space-x-2 py-2 mt-2">
              <input
                type="checkbox"
                id="checkbox"
                className="w-4 h-4 border-slate-300 rounded accent-slate-900"
                disabled={loading}
                required
              />
              <label htmlFor="checkbox" className="text-[14px] text-slate-600">
                I agree to the{" "}
                <a href="#" className="font-bold text-slate-900 hover:underline">
                  Terms
                </a>
                {" & "}
                <a href="#" className="font-bold text-slate-900 hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a2634] text-white py-2 text-[14px] tracking-[0.2em]
                    font-semibold hover:bg-slate-700 disabled:bg-slate-400 cursor-pointer transition-all"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-3 text-center text-sm text-slate-600 border-t border-slate-100 pt-2">
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
