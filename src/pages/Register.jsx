// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/client";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await apiClient.post("/auth/register", {
        name,
        email,
        password,
      });
      localStorage.setItem("userInfo", JSON.stringify(res.data)); // Save token
      navigate("/dashboard"); // Redirect to dashboard
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-verse-cream flex flex-col items-center justify-center px-8 py-12">
      <div className="w-full max-w-md">
        <h1 className="font-serif text-3xl text-center text-verse-dark mb-2">
          BookVerse
        </h1>
        <h2 className="text-xl text-center text-gray-500 mb-12">
          Join the Verse
        </h2>

        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 text-center mb-8">
          Start your curated literary journey today.
        </p>

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 block mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Elias Thorne"
              className="w-full bg-transparent border-b border-gray-300 py-3 focus:outline-none focus:border-verse-dark transition-colors"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 block mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="elias@example.com"
              className="w-full bg-transparent border-b border-gray-300 py-3 focus:outline-none focus:border-verse-dark transition-colors"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 block mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-gray-300 py-3 focus:outline-none focus:border-verse-dark transition-colors"
            />
          </div>

          <div className="flex items-start gap-3 py-4">
            <input type="checkbox" className="mt-1 accent-verse-dark" />
            <p className="text-xs text-gray-500 leading-relaxed">
              I agree to the{" "}
              <span className="underline cursor-pointer">Terms of Service</span>{" "}
              and{" "}
              <span className="underline cursor-pointer">Privacy Policy</span>.
            </p>
          </div>

          <button className="w-full bg-verse-dark text-white py-4 text-xs uppercase tracking-[0.2em] font-bold hover:bg-gray-800 transition-colors">
            Create Account
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <a href="/login" className="text-verse-dark font-bold underline">
            Sign In
          </a>
        </p>

        <footer className="mt-24 text-center">
          <p className="font-serif italic text-gray-600 mb-2">
            "A room without books is like a body without a soul."
          </p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">
            Cicero
          </p>
        </footer>
      </div>
    </div>
  );
}
