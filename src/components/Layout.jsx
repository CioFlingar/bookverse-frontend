// src/components/Layout.jsx
import { Mail, Share2 } from "lucide-react"; // Example using Lucide icons
import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-800">
      <Navbar />

      <main className="max-w-7xl mx-auto py-10 px-8">{children}</main>

      {/* Footer & links */}
      <footer className="mt-10 border-t border-gray-200 py-6 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">

          {/* Left Section: Branding */}
          <div className="space-y-2">
            <h2 className="text-slate-800 italic text-2xl font-semibold tracking-tight">
              BookVerse
            </h2>
            <p className="text-gray-500/70 text-xs uppercase tracking-wider">
              © 2026-WM BOOKVERSE. THE ART OF READING.
            </p>
          </div>

          {/* Center Section: Navigation Links */}
          <nav className="flex flex-wrap gap-x-8 gap-y-4">
            <a href="#" className="text-gray-500/80 text-[10px] font-medium uppercase tracking-widest
            hover:underline decoration-1 underline-offset-4">
              About Our Press
            </a>
            <a href="#" className="text-gray-500/80 text-[10px] font-medium uppercase tracking-widest
            hover:underline decoration-1 underline-offset-4">
              Shipping & Returns
            </a>
            <a href="#" className="text-gray-500/80 text-[10px] font-medium uppercase tracking-widest
            hover:underline decoration-1 underline-offset-4">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-500/80 text-[10px] font-medium uppercase tracking-widest
            hover:underline decoration-1 underline-offset-4">
              Terms of Service
            </a>
          </nav>

          {/* Right Section: Icons */}
          <div className="flex items-center gap-6">
            <button className="text-gray-500 hover:opacity-70 transition-opacity">
              <Share2 size={20} strokeWidth={1.5} />
            </button>
            <button className="text-gray-500 hover:opacity-70 transition-opacity">
              <Mail size={20} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
