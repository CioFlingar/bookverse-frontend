import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorAlert from "../components/ErrorAlert";
import Button from "../components/Button";
import { bookService } from "../services/bookService";
import { reviewService } from "../services/reviewService";
import { libraryService } from "../services/libraryService";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { ShoppingCart, Plus } from "lucide-react";

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();

  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchProduct = useCallback(async () => {
    try {
      const bookData = await bookService.getBook(id);
      setBook(bookData);
      
      const reviewsData = await reviewService.getBookReviews(id);
      setReviews(reviewsData.reviews || []);
    } catch (err) {
      setError("Failed to load product");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProduct();
  }, [fetchProduct]);

  const handleAddToCart = () => {
    if (book && book.stock > 0) {
      addItem(book);
    }
  };

  const handleAddToLibrary = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      await libraryService.addToLibrary(id, "Owned");
      alert("Added to library!");
    } catch {
      alert("Failed to add to library");
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setSubmittingReview(true);
    try {
      await reviewService.createReview(id, reviewForm.rating, reviewForm.comment);
      setReviewForm({ rating: 5, comment: "" });
      fetchProduct();
    } catch {
      alert("Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="font-serif bg-white">
        <Navbar />
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="font-serif bg-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <ErrorAlert message={error || "Book not found"} />
        </div>
      </div>
    );
  }

  return (
    <div className="font-serif bg-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <button onClick={() => navigate("/catalog")} className="text-slate-600 hover:text-slate-900 mb-8">
          ← Back to Catalog
        </button>

        <div className="grid md:grid-cols-2 gap-12 mb-12">
          {/* Image */}
          <div className="flex items-center justify-center bg-gray-100 rounded-lg h-96">
            <img
              src={book.image || "https://via.placeholder.com/400x500"}
              alt={book.title}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2">{book.title}</h1>
              <p className="text-lg text-slate-600 mb-4">by {book.author}</p>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex text-yellow-400 text-2xl">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>{i < Math.round(book.rating || 0) ? "★" : "☆"}</span>
                  ))}
                </div>
                <span className="text-slate-600">({book.reviewsCount || 0} reviews)</span>
              </div>
            </div>

            <div className="border-t border-b py-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-slate-600">ISBN:</span>
                <span className="font-semibold">{book.isbn || "Not listed"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Pages:</span>
                <span className="font-semibold">{book.pageCount || "Not listed"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Published:</span>
                <span className="font-semibold">
                  {book.releaseDate ? new Date(book.releaseDate).getFullYear() : "Not listed"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Publisher:</span>
                <span className="font-semibold">{book.publisher || "Not listed"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Language:</span>
                <span className="font-semibold">{book.language}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Stock:</span>
                <span className={`font-semibold ${book.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                  {book.stock > 0 ? `${book.stock} available` : "Out of Stock"}
                </span>
              </div>
            </div>

            <div className="text-4xl font-bold text-slate-900">\${book.price}</div>

            <div className="space-y-3">
              <Button
                variant="primary"
                size="lg"
                onClick={handleAddToCart}
                disabled={book.stock === 0}
                className="w-full"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={handleAddToLibrary}
                className="w-full"
              >
                <Plus size={20} />
                Add to Library
              </Button>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">About This Book</h2>
          <p className="text-slate-600 leading-relaxed">
            {book.description || "No description available"}
          </p>
        </div>

        {/* Reviews Section */}
        <div className="border-t pt-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Reviews</h2>

          {isAuthenticated && (
            <form onSubmit={handleSubmitReview} className="mb-8 p-6 bg-gray-50 rounded-lg space-y-4">
              <h3 className="font-semibold text-slate-900">Leave a Review</h3>
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-2">Rating</label>
                <select
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm({ ...reviewForm, rating: parseInt(e.target.value) })}
                  className="border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>{n} ★</option>
                  ))}
                </select>
              </div>
              <textarea
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                placeholder="Share your thoughts..."
                rows="4"
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
              <Button type="submit" loading={submittingReview}>
                Submit Review
              </Button>
            </form>
          )}

          <div className="space-y-6">
            {reviews.length === 0 ? (
              <p className="text-slate-500">No reviews yet. Be the first to review!</p>
            ) : (
              reviews.map((review) => (
                <div key={review._id} className="border-b pb-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-slate-900">{review.userId?.name || "Anonymous"}</p>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>{i < review.rating ? "★" : "☆"}</span>
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-slate-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-700">{review.comment}</p>
                  {review.verifiedPurchase && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded mt-2 inline-block">
                      ✓ Verified Purchase
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
