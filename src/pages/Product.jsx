import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorAlert from "../components/ErrorAlert";
import Button from "../components/Button";
import StarRating from "../components/StarRating";
import { bookService } from "../services/bookService";
import { reviewService } from "../services/reviewService";
import { libraryService } from "../services/libraryService";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { useWishlist } from "../hooks/useWishlist";
import { ShoppingCart, Plus, Trash2, Edit3, Heart } from "lucide-react";

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { user, isAuthenticated } = useAuth();

  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [editingReviewId, setEditingReviewId] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [wishlistBusy, setWishlistBusy] = useState(false);

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
    setReviewError("");
    try {
      if (editingReviewId) {
        await reviewService.updateReview(editingReviewId, reviewForm.rating, reviewForm.comment);
      } else {
        await reviewService.createReview(id, reviewForm.rating, reviewForm.comment);
      }
      setReviewForm({ rating: 5, comment: "" });
      setEditingReviewId("");
      await fetchProduct();
    } catch (err) {
      setReviewError(err.response?.data?.message || "Failed to save review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleEditReview = (review) => {
    setEditingReviewId(review._id);
    setReviewForm({
      rating: review.rating,
      comment: review.comment || "",
    });
    setReviewError("");
  };

  const handleDeleteReview = async (reviewId) => {
    setReviewError("");
    try {
      await reviewService.deleteReview(reviewId);
      if (editingReviewId === reviewId) {
        setEditingReviewId("");
        setReviewForm({ rating: 5, comment: "" });
      }
      await fetchProduct();
    } catch (err) {
      setReviewError(err.response?.data?.message || "Failed to delete review");
    }
  };

  const handleToggleWishlist = async () => {
    if (!book) return;

    setWishlistBusy(true);
    try {
      await toggleWishlist(book);
    } catch (err) {
      setReviewError(err.response?.data?.message || "Failed to update wishlist");
    } finally {
      setWishlistBusy(false);
    }
  };

  const currentUserId = user?._id || user?.id;
  const userReview = reviews.find((review) => review.user?._id === currentUserId);
  const canCreateReview = isAuthenticated && (!userReview || editingReviewId);
  const wishlisted = book ? isWishlisted(book._id) : false;

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
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <button onClick={() => navigate("/catalog")} className="mb-8 rounded-md px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900">
          ← Back to Catalog
        </button>

        <div className="mb-12 grid gap-8 rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-[0.9fr_1.1fr] md:p-8 lg:gap-12">
          <div className="flex items-center justify-center rounded-lg bg-slate-100 p-4">
            <img
              src={book.image || "https://via.placeholder.com/400x500"}
              alt={book.title}
              className="max-h-[520px] w-full rounded-md object-cover shadow-md"
            />
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="mb-2 text-4xl font-bold font-serif text-slate-950">{book.title}</h1>
              <p className="text-lg text-slate-600 mb-4">by {book.author}</p>
              
              <StarRating
                value={book.rating}
                count={book.reviewsCount || 0}
                size="lg"
                className="mb-4"
              />
            </div>

            <div className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-5">
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

            <div className="text-4xl font-bold text-slate-950">\${book.price}</div>

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
              {isAuthenticated && (
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={handleToggleWishlist}
                  loading={wishlistBusy}
                  className="w-full"
                >
                  <Heart size={20} className={wishlisted ? "fill-current text-amber-600" : ""} />
                  {wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="mb-12 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">About This Book</h2>
          <p className="text-slate-600 leading-relaxed">
            {book.description || "No description available"}
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Reviews</h2>

          {reviewError && (
            <ErrorAlert message={reviewError} onClose={() => setReviewError("")} className="mb-6" />
          )}

          {canCreateReview && (
            <form onSubmit={handleSubmitReview} className="mb-8 p-6 bg-gray-50 rounded-lg space-y-4">
              <h3 className="font-semibold text-slate-900">
                {editingReviewId ? "Edit Your Review" : "Leave a Review"}
              </h3>
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-2">Rating</label>
                <StarRating
                  value={reviewForm.rating}
                  size="lg"
                  interactive
                  onChange={(rating) => setReviewForm({ ...reviewForm, rating })}
                />
              </div>
              <textarea
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                placeholder="Share your thoughts..."
                rows="4"
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
              <div className="flex flex-wrap gap-3">
                <Button type="submit" loading={submittingReview}>
                  {editingReviewId ? "Save Review" : "Submit Review"}
                </Button>
                {editingReviewId && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setEditingReviewId("");
                      setReviewForm({ rating: 5, comment: "" });
                    }}
                    disabled={submittingReview}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          )}

          {!isAuthenticated && (
            <div className="mb-8 rounded-lg border border-slate-200 p-6 text-sm text-slate-600">
              Sign in to leave a rating or review.
            </div>
          )}

          <div className="space-y-6">
            {reviews.length === 0 ? (
              <p className="text-slate-500">No reviews yet. Be the first to review!</p>
            ) : (
              reviews.map((review) => (
                <div key={review._id} className="border-b pb-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-slate-900">{review.user?.name || "Anonymous"}</p>
                      <StarRating value={review.rating} size="sm" />
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                      {review.user?._id === currentUserId && (
                        <div className="mt-2 flex justify-end gap-2">
                          <button
                            onClick={() => handleEditReview(review)}
                            className="text-xs text-slate-600 hover:text-slate-900 inline-flex items-center gap-1"
                          >
                            <Edit3 size={14} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteReview(review._id)}
                            className="text-xs text-red-600 hover:text-red-800 inline-flex items-center gap-1"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
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
