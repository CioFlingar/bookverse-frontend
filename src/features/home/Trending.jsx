// src/features/home/Trending.jsx
import BookCard from '../../components/BookCard';

const trendingBooks = [
  {
    category: "Historical Fiction",
    title: "The Glass Kingdom",
    author: "Lawrence Whitmore",
    price: 28.00,
    imageColor: "bg-blue-900", // Representative of the dark blue cover
  },
  {
    category: "Science",
    title: "Notes on Gravity",
    author: "Dr. Sarah Vance",
    price: 32.00,
    imageColor: "bg-teal-800", // Representative of the teal cover
  },
  {
    category: "Mystery",
    title: "The Orchid Thief's Daughter",
    author: "Isabella Moreno",
    price: 26.00,
    imageColor: "bg-orange-100", // High contrast like the "ORCHID"
  },
  {
    category: "Thriller",
    title: "Shadow Architect",
    author: "Marcus Thorne",
    price: 29.00,
    imageColor: "bg-stone-800", // Dark aesthetic for thriller
  }
];

export default function Trending() {
  return (
    <section className="mb-10">
      <div className="flex justify-between items-end mb-8">
        <div className="max-w-xl">
          <h3 className="text-md uppercase tracking-[0.2em] font-bold text-slate-800 mb-4">
            Trending This Week
          </h3>
          <p className="text-lg font-serif text-gray-600 leading-relaxed">
            Curated selections from our editors that are capturing the imagination of our readers worldwide.
          </p>
        </div>
        <button className="text-xs uppercase tracking-widest font-bold border-b border-verse-dark pb-1
        hover:text-gray-500 hover:border-gray-500 transition-all">
          Explore the Full Catalog
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
        {trendingBooks.map((book, index) => (
          <BookCard key={index} {...book} />
        ))}
      </div>
    </section>
  );
}