// src/components/Layout.jsx
import { Mail, Share2 } from "lucide-react";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">{children}</main>

      <footer className="mt-10 border-t border-slate-200 bg-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="space-y-2">
            <h2 className="text-slate-800 italic text-2xl font-semibold tracking-tight">
              BookVerse
            </h2>
            <p className="text-xs uppercase tracking-wider text-slate-500">
              2026 WM BookVerse. The art of reading.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-8 gap-y-4">
            <a href="#" className="text-[10px] font-medium uppercase tracking-widest text-slate-500 hover:text-slate-900">
              About Our Press
            </a>
            <a href="#" className="text-[10px] font-medium uppercase tracking-widest text-slate-500 hover:text-slate-900">
              Shipping & Returns
            </a>
            <a href="#" className="text-[10px] font-medium uppercase tracking-widest text-slate-500 hover:text-slate-900">
              Privacy Policy
            </a>
            <a href="#" className="text-[10px] font-medium uppercase tracking-widest text-slate-500 hover:text-slate-900">
              Terms of Service
            </a>
          </nav>

          <div className="flex items-center gap-6">
            <button className="rounded-md p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900">
              <Share2 size={20} strokeWidth={1.5} />
            </button>
            <button className="rounded-md p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900">
              <Mail size={20} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
