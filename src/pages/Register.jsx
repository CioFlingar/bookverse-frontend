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
    <div class="font-serif bg-gray-50">
      <div class="text-center flex flex-col  min-h-screen justify-center items-center p-4 relative">
        <div class="text-center mb-4">
          <h2 class="text-2xl italic text-slate-800">BookVerse</h2>
          <p class="uppercase tracking-[0.3em] text-[10px] text-slate-500 mt-1">
            curated for the bibliophile
          </p>
        </div>

        <div class="bg-white border border-slate-200 w-full max-w-md py-8 px-12 md:p-10 shadow-sm">
          <div class="text-left mb-6">
            <h3 class="text-2xl text-slate-800 mb-2">Join the Verse</h3>
            <p class="text-slate-500 text-sm mb-2">
              Start your curated literary journey today.
            </p>
          </div>

          <form action="#" onSubmit={handleRegister}  class="space-y-5">
            <div class="flex flex-col">
              <label
                for="name"
                class="text-left uppercase text-[14px] font-bold tracking-wider text-slate-700 mb-1"
              >
                full name
              </label>
              <input
                type="name"
                id="name"
                value={name}
              onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Doe"
                class="border-b border-slate-300 py-2 focus:outline-none focus:border-slate-900 transition-colors placeholder:text-slate-300 text-sm"
              />
            </div>
            <div class="flex flex-col">
              <label
                for="email"
                class="text-left uppercase text-[14px] font-bold tracking-wider text-slate-700"
              >
                email address
              </label>
              <input
                type="email"
                value={email}
              onChange={(e) => setEmail(e.target.value)}
                id="email"
                placeholder="e.g. reader@bookverse.com"
                class="border-b border-slate-300 py-2 focus:outline-none focus:border-slate-900 transition-colors
                             placeholder:text-slate-300 text-sm"
              />
            </div>

            <div class="flex flex-col">
              <label
                for="password"
                class="text-left uppercase text-[14px] font-bold tracking-wider text-slate-700"
              >
                password
              </label>
              <input
                type="password"
                value={password}
              onChange={(e) => setPassword(e.target.value)}
                id="password"
                placeholder="........"
                class="border-b border-slate-300 py-1 focus:outline-none focus:border-slate-900 transition-colors
                             placeholder:text-slate-300 text-[25px]"
              />
            </div>

            <div class="flex items-center space-x-2 py-2 mt-2">
              <input
                type="checkbox"
                id="checkbox"
                class="w-4 h-4 border-slate-300 rounded accent-slate-900"
              />
              <label for="checkbox" class="text-[14px] text-slate-600">
                {" "}
                I agree to the{" "}
                <span>
                  <a href="#" class="font-bold text-slate-900 hover:underline">
                    Terms
                  </a>
                </span>{" "}
                & Privacy Policy.
              </label>
            </div>

            <div
              class="w-full bg-[#1a2634] text-white py-2 text-[14px] tracking-[0.2em]
                    font-semibold hover:bg-slate-700 cursor-pointer transition-all"
            >
              <input type="button" id="submit" />
              <label for="submit">Create Account</label>
            </div>
          </form>

          <div class="mt-3 text-center text-sm text-slate-600 border-t border-slate-100 pt-2">
            <span>Already have an account?</span>
            <a href="#" class="font-bold text-slate-900 hover:underline">
              Sign In
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
