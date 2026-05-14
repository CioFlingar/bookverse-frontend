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
import {
  ArrowLeft,
  BookMarked,
  CheckCircle2,
  ClipboardList,
  Edit3,
  Globe2,
  Heart,
  Package,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Trash2,
  Truck,
} from "lucide-react";

const formatCurrency = (value) => `$${Number(value || 0).toFixed(2)}`;

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
  const releaseYear = book?.releaseDate ? new Date(book.releaseDate).getFullYear() : "Not listed";
  const detailItems = book
    ? [
        { label: "ISBN", value: book.isbn || "Not listed", icon: ClipboardList },
        { label: "Pages", value: book.pageCount || "Not listed", icon: BookMarked },
        { label: "Published", value: releaseYear, icon: ShieldCheck },
        { label: "Publisher", value: book.publisher || "Not listed", icon: Package },
        { label: "Language", value: book.language || "Not listed", icon: Globe2 },
        {
          label: "Stock",
          value: book.stock > 0 ? `${book.stock} available` : "Out of stock",
          icon: Truck,
          tone: book.stock > 0 ? "text-emerald-700" : "text-red-700",
        },
      ]
    : [];

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
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <button
          onClick={() => navigate("/catalog")}
          className="mb-6 inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to catalog
        </button>

        <section className="mb-8 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="grid gap-0 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="border-b border-slate-200 bg-slate-100 p-6 sm:p-8 lg:border-b-0 lg:border-r">
              <div className="mx-auto max-w-sm">
                <div className="relative rounded-lg bg-white p-4 shadow-sm">
                  {book.category && (
                    <span className="absolute left-6 top-6 rounded-md bg-white/95 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-slate-600 shadow-sm">
                      {book.category}
                    </span>
                  )}
                  <img
                    src={book.image || "https://via.placeholder.com/400x500"}
                    alt={book.title}
                    className="aspect-[3/4] w-full rounded-md object-cover shadow-lg"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 lg:p-10">
              <div className="mb-6">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-amber-700">
                  BookVerse selection
                </p>
                <h1 className="font-serif text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
                  {book.title}
                </h1>
                <p className="mt-3 text-lg text-slate-600">by {book.author}</p>

                <div className="mt-5">
                  <StarRating
                    value={book.rating}
                    count={book.reviewsCount || reviews.length || 0}
                    size="lg"
                  />
                </div>
              </div>

              <div className="mb-6 flex flex-col gap-3 border-y border-slate-100 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                    Price
                  </p>
                  <p className="mt-1 font-serif text-4xl font-bold text-slate-950">
                    {formatCurrency(book.price)}
                  </p>
                </div>
                <span
                  className={`w-fit rounded-full px-3 py-1 text-sm font-bold ${
                    book.stock > 0
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {book.stock > 0 ? "In stock" : "Out of stock"}
                </span>
              </div>

              <div className="mb-6 grid gap-3 sm:grid-cols-2">
                {detailItems.map(({ label, value, icon: Icon, tone }) => (
                  <div
                    key={label}
                    className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-white text-slate-500 shadow-sm">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                        {label}
                      </p>
                      <p className={`mt-1 truncate text-sm font-semibold text-slate-800 ${tone || ""}`}>
                        {value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={book.stock === 0}
                  className="w-full"
                >
                  <ShoppingCart size={20} />
                  Add to cart
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={handleAddToLibrary}
                  className="w-full"
                >
                  <Plus size={20} />
                  Add to library
                </Button>
                {isAuthenticated && (
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={handleToggleWishlist}
                    loading={wishlistBusy}
                    className="w-full sm:col-span-2"
                  >
                    <Heart size={20} className={wishlisted ? "fill-current text-amber-600" : ""} />
                    {wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  </Button>
                )}
              </div>

              <div className="mt-6 rounded-lg bg-slate-50 p-4">
                <p className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Secure checkout and saved library access with your BookVerse account.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-700">
            About this book
          </p>
          <h2 className="mb-4 font-serif text-3xl font-bold text-slate-950">
            Synopsis
          </h2>
          <p className="max-w-4xl text-base leading-8 text-slate-600">
            {book.description || "No description available"}
          </p>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-700">
                Reader feedback
              </p>
              <h2 className="font-serif text-3xl font-bold text-slate-950">
                Reviews
              </h2>
            </div>
            <p className="text-sm text-slate-500">
              {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
            </p>
          </div>

          {reviewError && (
            <ErrorAlert message={reviewError} onClose={() => setReviewError("")} className="mb-6" />
          )}

          {canCreateReview && (
            <form onSubmit={handleSubmitReview} className="mb-8 space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-5">
              <h3 className="font-serif text-xl font-bold text-slate-950">
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
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
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
            <div className="mb-8 flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
              <span>Sign in to leave a rating or review.</span>
              <Button variant="secondary" onClick={() => navigate("/login")}>
                Sign in
              </Button>
            </div>
          )}

          <div className="space-y-6">
            {reviews.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">
                <h3 className="font-serif text-2xl font-bold text-slate-950">
                  No reviews yet
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Be the first reader to share a thought about this title.
                </p>
              </div>
            ) : (
              reviews.map((review) => (
                <div key={review._id} className="rounded-lg border border-slate-100 p-5">
                  <div className="mb-3 flex justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900">{review.user?.name || "Anonymous"}</p>
                      <StarRating value={review.rating} size="sm" />
                    </div>
                    <div className="shrink-0 text-right">
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
                  <p className="leading-7 text-slate-700">{review.comment}</p>
                  {review.verifiedPurchase && (
                    <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Verified purchase
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
