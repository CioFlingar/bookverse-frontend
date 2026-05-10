import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/client";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await apiClient.post("/auth/login", { email, password });
      localStorage.setItem("userInfo", JSON.stringify(res.data));
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-verse-cream flex flex-col items-center justify-center px-8">
      <div className="w-full max-w-md">
        <h1 className="font-serif text-3xl text-center text-verse-dark mb-2">BookVerse</h1>
        <h2 className="text-xl text-center text-gray-500 mb-12 italic">Welcome Back</h2>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 block mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-b border-gray-300 py-3 focus:outline-none focus:border-verse-dark transition-colors"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Password</label>
              <a href="#" className="text-[10px] uppercase tracking-widest text-gray-400 underline hover:text-verse-dark">Forgot?</a>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-gray-300 py-3 focus:outline-none focus:border-verse-dark transition-colors"
            />
          </div>

          <button className="w-full bg-verse-dark text-white py-4 text-xs uppercase tracking-[0.2em] font-bold hover:bg-gray-800 transition-colors">
            Sign In
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          New to the collection? <a href="/register" className="text-verse-dark font-bold underline">Join the Verse</a>
        </p>
      </div>
    </div>
  );
}
