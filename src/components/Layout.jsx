// src/components/Layout.jsx
import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-800">
      <Navbar />

      <main className="max-w-7xl mx-auto py-10 px-8">{children}</main>

      {/* Footer & links */}
      <footer className="mt-10 border-t border-gray-200 py-10 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div flex flex-col >
            <div class="mb-4 md:mb-0 font-bold text-slate-800 italic">
              BookVerse
            </div>
            <p className="text-xs text-gray-500 uppercase tracking-widest">
              © 2024 BOOKVERSE. THE ART OF READING.
            </p>
          </div>

          <div className="flex gap-6 text-xs text-gray-500 uppercase tracking-tighter font-bold">
            <a href="#" className="hover:text-slate-800 underline">About our Press</a>
            <a href="#" className="hover:text-slate-800 underline">Shipping & Returns</a>
            <a href="#" className="hover:text-slate-800 underline">Privacy Policy</a>
            <a href="#" className="hover:text-slate-800 underline">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
