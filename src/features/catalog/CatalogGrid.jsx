// src/features/catalog/CatalogGrid.jsx
import BookCard from "../../components/BookCard";

const catalogBooks = [
  {
    title: "The Archeology of Mind",
    author: "Jakob S. Sterling",
    price: 32.0,
    category: "Philosophy",
    imageColor: "bg-[#D2C5B3]",
  },
  {
    title: "Silence and Solitude",
    author: "Eleanor Vance",
    price: 24.5,
    category: "Essays",
    imageColor: "bg-blue-900",
  },
  {
    title: "Architectural Poetry",
    author: "Marcus Thorne",
    price: 48.0,
    category: "Architecture",
    imageColor: "bg-gray-100",
  },
  {
    title: "Nocturnal Narratives",
    author: "S. L. Nightly",
    price: 28.0,
    category: "Fiction",
    imageColor: "bg-black",
  },
  {
    title: "The Morning Ritual",
    author: "Clara H. Bennett",
    price: 19.95,
    category: "Lifestyle",
    imageColor: "bg-stone-200",
  },
  {
    title: "Modern Minimalism",
    author: "Julian Kross",
    price: 55.0,
    category: "Design",
    imageColor: "bg-white",
  },
];

export default function CatalogGrid() {
  return (
    <div className="flex-1">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-serif text-verse-dark">
            Curated Catalog
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Showing 142 titles from independent presses [cite: 49]
          </p>
        </div>
        <select className="text-sm border-none bg-transparent font-medium focus:ring-0">
          <option>Sort By: Newest First [cite: 50]</option>
          <option>Price: Low to High</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
        {catalogBooks.map((book, idx) => (
          <BookCard key={idx} {...book} />
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-16 flex justify-center gap-4 text-sm font-medium">
        <span className="cursor-pointer text-verse-dark border-b border-verse-dark">
          1
        </span>
        <span className="cursor-pointer text-gray-400 hover:text-verse-dark">
          2
        </span>
        <span className="cursor-pointer text-gray-400 hover:text-verse-dark">
          3
        </span>
        <span className="text-gray-400">...</span>
        <span className="cursor-pointer text-gray-400 hover:text-verse-dark">
          12
        </span>
      </div>
    </div>
  );
}
