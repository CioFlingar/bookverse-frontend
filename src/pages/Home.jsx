import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import CategoryGrid from "../features/home/CategoryGrid";
import Hero from "../features/home/Hero";
import Quote from "../features/home/Quote";
import Trending from "../features/home/Trending";
import { useCart } from "../hooks/useCart";
import { bookService } from "../services/bookService";
import { quoteService } from "../services/quoteService";

export default function Home() {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [books, setBooks] = useState([]);
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      try {
        const [booksData, quoteData] = await Promise.all([
          bookService.getBooks({ limit: 12, sort: "-createdAt" }),
          quoteService.getRandomQuote(),
        ]);

        setBooks(booksData.books || []);
        setQuote(quoteData?.text ? quoteData : null);
        setError("");
      } catch (err) {
        setError("Some homepage sections could not be loaded.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const featuredBook = useMemo(
    () =>
      [...books].sort(
        (a, b) =>
          (b.rating || 0) - (a.rating || 0) ||
          new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
      )[0],
    [books],
  );

  const categories = useMemo(() => {
    const counts = books.reduce((acc, book) => {
      const names = book.genre?.length ? book.genre : [book.category || "Uncategorized"];
      names.forEach((name) => {
        acc[name] = (acc[name] || 0) + 1;
      });
      return acc;
    }, {});

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);
  }, [books]);

  const trendingBooks = useMemo(
    () =>
      [...books]
        .filter((book) => book._id !== featuredBook?._id)
        .sort(
          (a, b) =>
            (b.rating || 0) - (a.rating || 0) ||
            (b.reviewsCount || 0) - (a.reviewsCount || 0),
        )
        .slice(0, 4),
    [books, featuredBook],
  );

  const handleBookDetails = (book) => {
    navigate(`/product/${book._id}`);
  };

  const handleAddFeaturedToCart = () => {
    if (featuredBook?.stock > 0) {
      addItem(featuredBook);
    }
  };

  return (
    <Layout>
      {error && (
        <div className="mb-6 border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <Hero
        book={featuredBook}
        loading={loading}
        onViewBook={handleBookDetails}
        onAddToCart={handleAddFeaturedToCart}
      />
      <CategoryGrid categories={categories} loading={loading} />
      <Trending books={trendingBooks} loading={loading} onViewBook={handleBookDetails} />
      <Quote quote={quote} loading={loading} />
    </Layout>
  );
}
