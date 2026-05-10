// src/features/dashboard/ProgressCard.jsx
export default function ProgressCard({ title, author, progress, pagesRead, totalPages }) {
  return (
    <div className="bg-white p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
      <div>
        <h4 className="font-serif text-lg text-verse-dark mb-1">{title}</h4>
        <p className="text-xs text-gray-500 mb-4">{author}</p>

        {/* Progress Bar  */}
        <div className="w-full bg-gray-100 h-1.5 mb-2">
          <div
            className="bg-verse-dark h-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-[10px] uppercase tracking-widest text-gray-400 font-bold">
          <span>{progress}% Complete</span>
          {pagesRead && <span>{pagesRead}/{totalPages} Pages</span>}
        </div>
      </div>

      <button className="mt-6 text-[10px] uppercase tracking-[0.2em] font-bold border border-verse-dark py-2 hover:bg-verse-dark hover:text-white transition-all">
        Continue Reading
      </button>
    </div>
  );
}