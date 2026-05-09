// src/features/catalog/Sidebar.jsx
export default function Sidebar() {
  const genres = ["Contemporary Fiction", "Classic Literature", "Philosophy & Essays", "Poetry", "Art & Design"];
  const authors = ["Joan Didion", "Albert Camus", "Virginia Woolf"];

  return (
    <aside className="w-64 flex-shrink-0 space-y-10">
      {/* Genre Filter */}
      <div>
        <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-4">Genre</h3>
        <ul className="space-y-2">
          {genres.map((genre) => (
            <li key={genre} className="flex items-center gap-3 text-sm text-gray-600">
              <input type="checkbox" className="rounded border-gray-300 accent-verse-dark" />
              {genre}
            </li>
          ))}
        </ul>
      </div>

      {/* Author Filter */}
      <div>
        <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-4">Author</h3>
        <ul className="space-y-2">
          {authors.map((author) => (
            <li key={author} className="flex items-center gap-3 text-sm text-gray-600">
              <input type="checkbox" className="rounded border-gray-300 accent-verse-dark" />
              {author}
            </li>
          ))}
        </ul>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-4">Price Range</h3>
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>$10</span>
          <span>$150</span>
        </div>
        <input type="range" min="10" max="150" className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-verse-dark" />
      </div>
    </aside>
  );
}