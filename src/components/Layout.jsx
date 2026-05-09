// src/components/Layout.jsx
import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-verse-cream font-sans text-verse-dark">
      <Navbar />

      <main className="max-w-7xl mx-auto py-10 px-8">
        {children}
      </main>

      <footer className="mt-20 border-t border-gray-200 py-12 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-gray-400 uppercase tracking-widest">
            2024 BOOKVERSE. THE ART OF READING [cite: 35, 84]
          </p>
          <div className="flex gap-6 text-xs text-gray-500 uppercase tracking-tighter font-bold">
            <a href="#">About our Press</a>
            <a href="#">Shipping & Returns</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}