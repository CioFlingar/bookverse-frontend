import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "../components/Button";
import BookCard from "../components/BookCard";
import ErrorAlert from "../components/ErrorAlert";
import LoadingSpinner from "../components/LoadingSpinner";
import Navbar from "../components/Navbar";
import { useWishlist } from "../hooks/useWishlist";

export default function Wishlist() {
  const navigate = useNavigate();
  const {
    items,
    loading,
    error,
    clearError,
    clearWishlist,
  } = useWishlist();
  const [clearing, setClearing] = useState(false);

  const handleClearWishlist = async () => {
    setClearing(true);
    try {
      await clearWishlist();
    } catch {
      // WishlistContext renders the error message above the list.
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold font-serif text-slate-950">Wishlist</h1>
            <p className="mt-2 text-sm text-slate-500">
              {items.length > 0
                ? `${items.length} ${items.length === 1 ? "book" : "books"} saved for later`
                : "Save books here while you decide what to read next"}
            </p>
          </div>
          {items.length > 0 && (
            <Button variant="tertiary" onClick={handleClearWishlist} loading={clearing}>
              Clear Wishlist
            </Button>
          )}
        </div>

        {error && <ErrorAlert message={error} onClose={clearError} className="mb-6" />}

        {loading ? (
          <div className="rounded-lg border border-slate-200 bg-white py-16">
            <LoadingSpinner size="lg" />
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <p className="font-semibold text-slate-800">Your wishlist is empty</p>
            <p className="mt-2 text-sm text-slate-500">
              Tap the heart on any book to keep it here.
            </p>
            <Button variant="primary" className="mt-6" onClick={() => navigate("/catalog")}>
              Browse Catalog
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((book) => (
              <BookCard
                key={book._id}
                book={book}
                onQuickView={() => navigate(`/product/${book._id}`)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
