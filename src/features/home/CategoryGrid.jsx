import { Link } from "react-router-dom";

export default function CategoryGrid({ categories = [], loading = false }) {
  return (
    <div className="mb-14">
      <h3 className="mb-6 text-sm font-bold uppercase tracking-[0.2em] text-slate-900">
        Popular Categories
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {loading &&
          [...Array(4)].map((_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-lg border border-slate-200 bg-white" />
          ))}
        {!loading && categories.length === 0 && (
          <div className="col-span-2 rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-500 md:col-span-4">
            Categories will appear once books are added to the catalog.
          </div>
        )}
        {!loading && categories.map((cat) => (
          <Link
            key={cat.name}
            to={`/catalog?genre=${encodeURIComponent(cat.name)}`}
            className="group rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
          >
            <h4 className="mb-1 text-lg font-semibold font-serif text-slate-900">{cat.name}</h4>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {cat.count} {cat.count === 1 ? "Title" : "Titles"}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
