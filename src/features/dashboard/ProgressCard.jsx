// src/features/dashboard/ProgressCard.jsx
export default function ProgressCard({ title, author, progress, pagesRead, totalPages }) {
  return (
    <div className="flex flex-col justify-between rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h4 className="mb-1 font-serif text-xl font-bold text-slate-950">{title}</h4>
        <p className="mb-5 text-sm text-slate-500">{author}</p>

        <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-slate-900 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
          <span>{progress}% Complete</span>
          {pagesRead && <span>{pagesRead}/{totalPages} Pages</span>}
        </div>
      </div>

      <button className="mt-6 rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-900 hover:bg-slate-50 hover:text-slate-950">
        Continue Reading
      </button>
    </div>
  );
}
