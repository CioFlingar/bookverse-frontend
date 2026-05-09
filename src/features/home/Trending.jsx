// src/features/home/Trending.jsx
import BookCard from '../../components/BookCard';

const trendingBooks = [
  {
    category: "Historical Fiction",
    title: "The Glass Kingdom",
    author: "Lawrence Whitmore",
    price: 28.00,
    imageColor: "bg-blue-900", // Representative of the dark blue cover [cite: 23, 24]
  },
  {
    category: "Science",
    title: "Notes on Gravity",
    author: "Dr. Sarah Vance",
    price: 32.00,
    imageColor: "bg-teal-800", // Representative of the teal cover [cite: 21, 25]
  },
  {
    category: "Mystery",
    title: "The Orchid Thief's Daughter",
    author: "Isabella Moreno",
    price: 26.00,
    imageColor: "bg-orange-100", // High contrast like the "ORCHID" cover [cite: 22, 27]
  },
  {
    category: "Thriller",
    title: "Shadow Architect",
    author: "Marcus Thorne",
    price: 29.00,
    imageColor: "bg-stone-800", // Dark aesthetic for thriller [cite: 29, 30]
  }
];

export default function Trending() {
  return (
    <section className="mb-20">
      <div className="flex justify-between items-end mb-10">
        <div className="max-w-xl">
          <h3 className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-4">
            Trending This Week [cite: 19]
          </h3>
          <p className="text-xl font-serif text-gray-600 leading-relaxed">
            Curated selections from our editors that are capturing the imagination of our readers worldwide. [cite: 20]
          </p>
        </div>
        <button className="text-xs uppercase tracking-widest font-bold border-b border-verse-dark pb-1 hover:text-gray-500 hover:border-gray-500 transition-all">
          Explore the Full Catalog [cite: 31]
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