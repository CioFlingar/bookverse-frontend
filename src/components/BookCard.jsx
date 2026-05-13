import { useState } from "react";
import { ShoppingCart, Heart } from "lucide-react";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { useWishlist } from "../hooks/useWishlist";
import StarRating from "./StarRating";

export default function BookCard({ book, onQuickView }) {
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [wishlistBusy, setWishlistBusy] = useState(false);
  const price = Number(book.price || 0).toFixed(2);
  const genre = book.genre?.[0] || book.category;
  const wishlisted = isWishlisted(book._id);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if ((book.stock ?? 0) > 0) {
      addItem(book);
    }
  };

  const handleToggleWishlist = async (event) => {
    event.stopPropagation();
    setWishlistBusy(true);
    try {
      await toggleWishlist(book);
    } catch {
      // WishlistContext exposes the error to wishlist surfaces; keep card clicks quiet.
    } finally {
      setWishlistBusy(false);
    }
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg">
      <button
        type="button"
        onClick={() => onQuickView?.(book)}
        className="relative block w-full overflow-hidden bg-slate-100 text-left"
      >
        <img
          src={book.image || "https://via.placeholder.com/300x400?text=No+Image"}
          alt={book.title}
          className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {(book.stock ?? 0) === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/60">
            <span className="rounded-md bg-white px-3 py-1 text-xs font-semibold text-slate-900">
              Out of Stock
            </span>
          </div>
        )}
      </button>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 min-h-11 text-base font-serif font-semibold leading-snug text-slate-900">
          {book.title}
        </h3>
        <p className="mb-3 truncate text-sm text-slate-500">{book.author}</p>

        <StarRating
          value={book.rating}
          count={book.reviewsCount || 0}
          size="xs"
          className="mb-2"
        />

        <div className="mb-4 mt-auto flex items-center justify-between gap-3">
          <span className="text-lg font-semibold text-slate-950">${price}</span>
          {genre && (
            <span className="max-w-32 truncate rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-800">
              {genre}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            disabled={(book.stock ?? 0) === 0}
            className="flex-1 rounded-md bg-slate-900 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-slate-800 disabled:bg-slate-300"
          >
            <span className="inline-flex items-center justify-center gap-2">
              <ShoppingCart size={16} />
              Add to Cart
            </span>
          </button>
          {isAuthenticated && (
            <button
              onClick={handleToggleWishlist}
              disabled={wishlistBusy}
              className={`rounded-md border px-3 py-2 transition-colors ${
                wishlisted
                  ? "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                  : "border-slate-300 text-slate-700 hover:border-slate-900 hover:bg-slate-50 hover:text-slate-900"
              }`}
              aria-label={wishlisted ? `Remove ${book.title} from wishlist` : `Add ${book.title} to wishlist`}
            >
              <Heart size={16} className={wishlisted ? "fill-current" : ""} />
            </button>
          )}
        </div>

        <button
          onClick={() => onQuickView?.(book)}
          className="mt-3 w-full rounded-md py-2 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
        >
          View Details
        </button>
      </div>
    </article>
  );
}
