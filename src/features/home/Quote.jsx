// src/features/home/Quote.jsx
export default function Quote() {
  return (
    <div className="py-24 border-t border-gray-200 text-center">
      <blockquote className="max-w-3xl mx-auto">
        <p className="font-serif text-2xl md:text-3xl text-gray-700 leading-snug mb-8">
          "A room without books is like a body without a soul. BookVerse has curated a collection that speaks to both the intellect and the spirit." [cite: 32]
        </p>
        <footer className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">
          MARCUS AURELIUS, COLLECTOR [cite: 33]
        </footer>
      </blockquote>
    </div>
  );
}