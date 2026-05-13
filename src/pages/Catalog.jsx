import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import BookCard from "../components/BookCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorAlert from "../components/ErrorAlert";
import StarRating from "../components/StarRating";
import { bookService } from "../services/bookService";

export default function Catalog() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    genre: searchParams.get("genre") || "",
    minPrice: 0,
    maxPrice: 100,
    rating: 0,
    sortBy: "-createdAt",
  });
  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
  });

  useEffect(() => {
    const nextSearch = searchParams.get("search") || "";
    const nextGenre = searchParams.get("genre") || "";

    const timer = setTimeout(() => {
      setSearchInput(nextSearch);
      setFilters((prev) => ({
        ...prev,
        search: nextSearch,
        genre: nextGenre,
      }));
      setPagination((prev) => ({ ...prev, page: 1 }));
    }, 0);

    return () => clearTimeout(timer);
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const nextSearch = searchInput.trim();
      setFilters((prev) => ({ ...prev, search: nextSearch }));
      setPagination((prev) => ({ ...prev, page: 1 }));

      const params = new URLSearchParams();
      if (nextSearch) params.set("search", nextSearch);
      if (filters.genre) params.set("genre", filters.genre);
      setSearchParams(params, { replace: true });
    }, 350);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

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

  const updateUrlFilters = (nextFilters) => {
    const params = new URLSearchParams();
    if (nextFilters.search) params.set("search", nextFilters.search);
    if (nextFilters.genre) params.set("genre", nextFilters.genre);
    setSearchParams(params, { replace: true });
  };

  const handleCatalogFilterChange = (key, value) => {
    if (key === "minPrice" || key === "maxPrice") {
      setFilters((prev) => {
        const next = { ...prev, [key]: value };
        if (next.minPrice > next.maxPrice) {
          if (key === "minPrice") next.maxPrice = value;
          if (key === "maxPrice") next.minPrice = value;
        }
        return next;
      });
      setPagination((prev) => ({ ...prev, page: 1 }));
      return;
    }

    handleFilterChange(key, value);

    if (key === "search" || key === "genre") {
      updateUrlFilters({ ...filters, [key]: value });
    }
  };

  const clearFilters = () => {
    const nextFilters = {
      search: "",
      genre: "",
      minPrice: 0,
      maxPrice: 100,
      rating: 0,
      sortBy: "-createdAt",
    };
    setSearchInput("");
    setFilters(nextFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
    setSearchParams({}, { replace: true });
  };

  const hasActiveFilters = useMemo(
    () =>
      Boolean(filters.search) ||
      Boolean(filters.genre) ||
      filters.minPrice > 0 ||
      filters.maxPrice < 100 ||
      filters.rating > 0 ||
      filters.sortBy !== "-createdAt",
    [filters],
  );

  const totalPages = Math.max(1, Math.ceil(pagination.total / pagination.limit));

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-4xl font-serif font-bold text-slate-950">Curated Catalog</h1>
            {filters.search && (
              <p className="mt-2 text-sm text-slate-500">
                Search results for "{filters.search}"
              </p>
            )}
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-semibold text-slate-600 hover:text-slate-900"
            >
              Clear filters
            </button>
          )}
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar Filters */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="sticky top-28 space-y-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              {/* Search */}
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-2">Search</label>
                <input
                  type="text"
                  placeholder="Book title or author..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              {/* Genre Filter */}
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-2">Genre</label>
                <select
                  value={filters.genre}
                  onChange={(e) => handleCatalogFilterChange("genre", e.target.value)}
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
                    onChange={(e) => handleCatalogFilterChange("minPrice", parseInt(e.target.value))}
                    className="w-full"
                  />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filters.maxPrice}
                    onChange={(e) => handleCatalogFilterChange("maxPrice", parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-2">Minimum Rating</label>
                <div className="space-y-2">
                  {[0, 4, 3, 2, 1].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => handleCatalogFilterChange("rating", rating)}
                      className={`w-full rounded border px-3 py-2 text-left text-sm transition-colors ${
                        filters.rating === rating
                          ? "border-slate-900 bg-slate-50 text-slate-900"
                          : "border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {rating === 0 ? (
                        "All Ratings"
                      ) : (
                        <div className="flex items-center justify-between gap-2">
                          <StarRating value={rating} size="xs" />
                          <span className="text-xs text-slate-500">& up</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-2">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleCatalogFilterChange("sortBy", e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="-createdAt">Newest</option>
                  <option value="createdAt">Oldest</option>
                  <option value="price">Price: Low to High</option>
                  <option value="-rating">Highest Rated</option>
                  <option value="rating">Lowest Rated</option>
                  <option value="title">Title: A to Z</option>
                </select>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {error && <ErrorAlert message={error} onClose={() => setError("")} />}

            {loading ? (
              <div className="flex justify-center rounded-lg border border-slate-200 bg-white py-16">
                <LoadingSpinner size="lg" />
              </div>
            ) : books.length === 0 ? (
              <div className="rounded-lg border border-slate-200 bg-white px-6 py-16 text-center">
                <p className="font-semibold text-slate-800">No books found</p>
                <p className="mt-2 text-sm text-slate-500">Try adjusting your search or filters.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {books.map((book) => (
                    <BookCard
                      key={book._id}
                      book={book}
                      onQuickView={() => navigate(`/product/${book._id}`)}
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
