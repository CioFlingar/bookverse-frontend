// src/features/catalog/CatalogGrid.jsx
import { useEffect, useState } from "react";
import apiClient from "../../api/client";
import BookCard from "../../components/BookCard";

export default function CatalogGrid() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await apiClient.get("/books");
        setBooks(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching books:", error);
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading)
    return (
      <div className="flex-1 py-20 text-center font-serif italic text-gray-400">
        Curating collection...
      </div>
    );

  return (
    <div className="flex-1">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-serif text-verse-dark">
            Curated Catalog
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Showing {books.length} titles from independent presses [cite: 49]
          </p>
        </div>
        <select className="text-sm border-none bg-transparent font-medium focus:ring-0">
          <option>Sort By: Newest First</option>
          <option>Price: Low to High</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
        {books.map((book) => (
          <BookCard
            key={book._id}
            id={book._id}
            category={book.category}
            title={book.title}
            author={book.author}
            price={book.price}
            imageColor={book.imageColor}
          />
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

        {/* New Quote */}
      <div className="mt-10 py-12 px-8">
        <div className="flex gap-8 max-w-3xl mx-auto items-stretch">
          {/* Vertical Red Accent */}
          <div className="w-[2px] bg-red-400" />

          <div className="flex flex-col">
            <blockquote className="text-slate-700 italic text-base md:text-lg leading-relaxed font-serif">
              "A truly great book should be read in youth, again in maturity and
              once more in old age, as a fine building should be seen by morning
              light, at noon and by moonlight."
            </blockquote>
            <cite className="mt-4 text-gray-400/70 text-xs uppercase tracking-widest not-italic">
              — Robertson Davies
            </cite>
          </div>
        </div>
      </div>
    </div>
  );
}
