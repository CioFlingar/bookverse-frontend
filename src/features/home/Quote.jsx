export default function Quote({ quote, loading = false }) {
  const text =
    quote?.text ||
    "A room without books is like a body without a soul. BookVerse has curated a collection that speaks to both the intellect and the spirit.";
  const author = quote?.author || "BookVerse";

  return (
    <div className="py-10 border-t border-gray-200 flex justify-center">
        <div className="border-red-400 border-l py-8 pl-6 md:pl-10">
            <blockquote className="max-w-2xl">
            <p className="font-serif italic text-xs md:text-xl text-slate-700 leading-snug mb-4">
          {loading ? "Loading today's quote..." : `"${text}"`}
            </p>
            <footer className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">
          - {author}
            </footer>
        </blockquote>
        </div>

    </div>

  );
}
