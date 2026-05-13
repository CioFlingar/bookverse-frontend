import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import BookCard from "../components/BookCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorAlert from "../components/ErrorAlert";
import { bookService } from "../services/bookService";

export default function Catalog() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    genre: "",
    minPrice: 0,
    maxPrice: 100,
    rating: 0,
    sortBy: "-createdAt",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
  });

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const result = await bookService.getBooks({
        search: filters.search,
        genre: filters.genre,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        minRating: filters.rating,
        sort: filters.sortBy,
        page: pagination.page,
        limit: pagination.limit,
      });
      setBooks(result.books || []);
      setPagination((prev) => ({ ...prev, total: result.pagination?.total || 0 }));
      setError("");
    } catch (err) {
      setError("Failed to load books");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.limit, pagination.page]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBooks();
  }, [fetchBooks]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return (
    <div className="font-serif bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-serif font-bold text-slate-900 mb-12">Curated Catalog</h1>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <div className="w-64 flex-shrink-0">
            <div className="sticky top-20 space-y-6">
              {/* Search */}
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-2">Search</label>
                <input
                  type="text"
                  placeholder="Book title or author..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              {/* Genre Filter */}
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-2">Genre</label>
                <select
                  value={filters.genre}
                  onChange={(e) => handleFilterChange("genre", e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="">All Genres</option>
                  <option value="Fiction">Fiction</option>
                  <option value="Philosophy">Philosophy</option>
                  <option value="Science">Science</option>
                  <option value="History">History</option>
                  <option value="Biography">Biography</option>
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-2">
                  Price Range: \${filters.minPrice} - \${filters.maxPrice}
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange("minPrice", parseInt(e.target.value))}
                    className="w-full"
                  />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange("maxPrice", parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-2">Minimum Rating</label>
                <select
                  value={filters.rating}
                  onChange={(e) => handleFilterChange("rating", parseInt(e.target.value))}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="0">All Ratings</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="2">2+ Stars</option>
                  <option value="1">1+ Stars</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-2">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="-createdAt">Newest</option>
                  <option value="createdAt">Oldest</option>
                  <option value="price">Price: Low to High</option>
                  <option value="rating">Rating</option>
                  <option value="title">Title: A to Z</option>
                </select>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {error && <ErrorAlert message={error} onClose={() => setError("")} />}

            {loading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : books.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-600">No books found. Try adjusting your filters.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {books.map((book) => (
                    <BookCard
                      key={book._id}
                      book={book}
                      onQuickView={() => navigate(`/product/${book._id}`)}
                      onAddToWishlist={(book) => console.log("Wishlist:", book)}
                    />
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center items-center gap-4 mt-8">
                  <button
                    onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page === 1}
                    className="px-4 py-2 border border-slate-900 text-slate-900 rounded hover:bg-slate-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-slate-600">
                    Page {pagination.page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page === totalPages}
                    className="px-4 py-2 border border-slate-900 text-slate-900 rounded hover:bg-slate-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
