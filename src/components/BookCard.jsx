import { ShoppingCart, Heart } from "lucide-react";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";

export default function BookCard({ book, onQuickView, onAddToWishlist }) {
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (book.stock > 0) {
      addItem(book);
    }
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Image */}
      <div className="relative w-full h-64 bg-gray-200 overflow-hidden group">
        <img
          src={book.image || "https://via.placeholder.com/300x400?text=No+Image"}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {book.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-sm font-serif font-semibold text-gray-800 truncate">
          {book.title}
        </h3>
        <p className="text-xs text-gray-500 mb-2">{book.author}</p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={i < Math.round(book.rating || 0) ? "★" : "☆"}>
              </span>
            ))}
          </div>
          <span className="text-xs text-gray-500">({book.reviewsCount || 0})</span>
        </div>

        {/* Price and Genre */}
        <div className="flex justify-between items-center mb-3">
          <span className="text-lg font-semibold text-slate-900">${book.price}</span>
          {book.genre && (
            <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
              {book.genre[0]}
            </span>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            disabled={book.stock === 0}
            className="flex-1 bg-slate-900 text-white py-2 rounded text-xs font-semibold hover:bg-slate-800 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingCart size={16} />
            Add to Cart
          </button>
          {isAuthenticated && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToWishlist?.(book);
              }}
              className="border border-slate-900 text-slate-900 py-2 px-3 rounded hover:bg-slate-50 transition-colors"
            >
              <Heart size={16} />
            </button>
          )}
        </div>

        {/* Quick View Link */}
        <button
          onClick={() => onQuickView?.(book)}
          className="w-full mt-2 text-slate-600 text-xs hover:text-slate-900 underline"
        >
          View Details
        </button>
      </div>
    </div>
  );
}
