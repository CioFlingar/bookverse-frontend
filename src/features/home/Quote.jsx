// src/features/home/Quote.jsx
export default function Quote() {
  return (
    <div className="py-10 border-t border-gray-200 text-left">
        <blockquote className="max-w-2xl mx-auto">
            <p className="font-serif italic text-xs md:text-xl text-slate-700 leading-snug mb-4">
          "A room without books is like a body without a soul. BookVerse has curated a collection that speaks to both the intellect and the spirit."
            </p>
            <footer className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">
          - MARCUS AURELIUS, COLLECTOR
            </footer>
        </blockquote>
    </div>

  );
}