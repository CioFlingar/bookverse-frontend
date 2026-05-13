import { Link } from "react-router-dom";
import BookCard from "../../components/BookCard";

export default function Trending({ books = [], loading = false, onViewBook }) {
  return (
    <section className="mb-12">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-slate-900">
            Trending This Week
          </h3>
          <p className="text-lg font-serif leading-relaxed text-slate-600">
            Curated selections from our editors that are capturing the imagination of our readers worldwide.
          </p>
        </div>
        <Link
          to="/catalog"
          className="w-fit rounded-md px-3 py-2 text-xs font-bold uppercase tracking-widest text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900">
          Explore the Full Catalog
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {loading &&
          [...Array(4)].map((_, index) => (
            <div key={index} className="h-96 animate-pulse rounded-lg border border-slate-200 bg-white" />
          ))}
        {!loading && books.length === 0 && (
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-sm text-slate-500 lg:col-span-4">
            No featured books are available yet.
          </div>
        )}
        {!loading &&
          books.map((book) => (
            <BookCard
              key={book._id}
              book={book}
              onQuickView={() => onViewBook(book)}
            />
          ))}
      </div>
    </section>
  );
}
