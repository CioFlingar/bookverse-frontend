import { Link } from "react-router-dom";

export default function Hero({ book, loading = false, onViewBook, onAddToCart }) {
  const title = book?.title || "Explore the BookVerse Catalog";
  const author = book?.author || "Independent authors and timeless voices";
  const description =
    book?.description ||
    "Discover new arrivals, reader favorites, and carefully curated titles from the BookVerse collection.";
  const image = book?.image || "/images/hero.jpg";
  const canAddToCart = book?.stock > 0;

  return (
    <section className="mb-16 overflow-hidden rounded-lg border border-slate-200 bg-white text-slate-800 shadow-sm">
      <div className="grid items-center gap-10 px-6 py-8 md:grid-cols-[1.1fr_0.9fr] md:px-10 lg:px-12 lg:py-12">
        <div className="max-w-xl">
          <span className="mb-4 block text-xs font-bold uppercase tracking-[0.2em] text-amber-700">
            {loading ? "Loading the shelves" : book ? "Featured from the catalog" : "BookVerse"}
          </span>
          <h2 className="mb-5 text-4xl font-bold leading-tight text-slate-950 font-serif md:text-5xl">
            {title}
          </h2>
          <p className="mb-4 text-sm italic tracking-widest text-slate-500">
            by {author}
          </p>
          <p className="mb-8 max-w-2xl leading-7 text-slate-600">
            {description}
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => (book ? onViewBook(book) : null)}
              disabled={!book}
              className="rounded-md bg-slate-900 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-slate-800 disabled:bg-slate-300"
            >
              Explore the Title
            </button>
            <button
              onClick={onAddToCart}
              disabled={!canAddToCart}
              className="rounded-md border border-slate-300 bg-white px-6 py-3 text-xs font-bold uppercase tracking-widest text-slate-900 transition-colors hover:border-slate-900 hover:bg-slate-50 disabled:opacity-50"
            >
              {book && !canAddToCart ? "Out of Stock" : "Add to Cart"}
            </button>
            <Link
              to="/catalog"
              className="rounded-md px-6 py-3 text-xs font-bold uppercase tracking-widest text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
            >
              Browse Catalog
            </Link>
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
          <div className="relative w-full max-w-xs rounded-lg border border-slate-200 bg-slate-100 p-4 shadow-xl">
            <img
              src={image}
              alt={book ? `${book.title} cover` : "BookVerse featured shelf"}
              className="aspect-[3/4] w-full rounded-md object-cover shadow-md"
            />
            {book?.category && (
              <div className="absolute left-4 top-4 rounded-md bg-white/95 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                {book.category}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
