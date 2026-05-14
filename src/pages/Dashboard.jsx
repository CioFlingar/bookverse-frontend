// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import {
  BookOpen,
  Heart,
  Library,
  PackagePlus,
  ShoppingBag,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import BookCard from "../components/BookCard";
import ErrorAlert from "../components/ErrorAlert";
import Input from "../components/Input";
import Layout from "../components/Layout";
import Modal from "../components/Modal";
import AdminOrdersTable from "../features/dashboard/AdminOrdersTable";
import AdminStats from "../features/dashboard/AminStats";
import InventoryTable from "../features/dashboard/InventoryTable";
import OrderHistory from "../features/dashboard/OrderHistory";
import ProgressCard from "../features/dashboard/ProgressCard";
import { useAuth } from "../hooks/useAuth";
import { useWishlist } from "../hooks/useWishlist";
import { adminService } from "../services/adminService";
import { authService } from "../services/authService";
import { bookService } from "../services/bookService";
import { libraryService } from "../services/libraryService";
import { orderService } from "../services/orderService";

const emptyBookForm = {
  title: "",
  author: "",
  price: "",
  category: "",
  image: "",
  stock: "",
  genre: "",
  description: "",
  language: "English",
  pageCount: "",
  publisher: "",
  releaseDate: "",
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  const { items: wishlist, loading: wishlistLoading } = useWishlist();
  const [profile, setProfile] = useState(null);
  const [library, setLibrary] = useState([]);
  const [stats, setStats] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [adminOrders, setAdminOrders] = useState([]);
  const [totalAdminOrders, setTotalAdminOrders] = useState(0);
  const [adminOrdersLoading, setAdminOrdersLoading] = useState(false);
  const [inventoryLoading, setInventoryLoading] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [bookForm, setBookForm] = useState(emptyBookForm);
  const [savingBook, setSavingBook] = useState(false);
  const [deletingBookId, setDeletingBookId] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [orderStatusFilter, setOrderStatusFilter] = useState("");

  const isAdmin = profile?.role === "admin";
  const adminTabs = [
    { id: "overview", label: "Overview" },
    { id: "catalog", label: "Catalog" },
    { id: "orders", label: "Orders" },
  ];
  const readerTabs = [
    { id: "overview", label: "Overview" },
    { id: "library", label: "Library" },
    { id: "wishlist", label: "Wishlist" },
    { id: "orders", label: "Orders" },
  ];
  const tabs = isAdmin ? adminTabs : readerTabs;
  const displayName = profile?.name || user?.name || "Reader";
  const firstName = displayName.split(" ")[0];
  const lowStockCount = inventory.filter((book) => Number(book.stock || 0) < 5).length;

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.token) return navigate("/login");

      try {
        const [profileData, libraryData] = await Promise.all([
          authService.getProfile(),
          libraryService.getUserLibrary({ limit: 20 }),
        ]);

        setProfile(profileData);
        updateUser(profileData);
        setLibrary(libraryData.books || []);
      } catch {
        logout();
        navigate("/login");
      }
    };

    fetchDashboardData();
  }, [logout, navigate, updateUser, user?.token]);

  useEffect(() => {
    if (!isAdmin) return;

    const fetchAdminData = async () => {
      setInventoryLoading(true);
      setAdminOrdersLoading(true);
      try {
        const [statsData, booksData, ordersData] = await Promise.all([
          adminService.getStats(),
          bookService.getBooks({ limit: 100, sort: "-createdAt" }),
          orderService.getAllOrders({ limit: 50, status: orderStatusFilter }),
        ]);

        setStats(statsData);
        setInventory(booksData.books || []);
        setAdminOrders(ordersData.orders || []);
        setTotalAdminOrders(ordersData.pagination?.total || 0);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load admin dashboard");
      } finally {
        setInventoryLoading(false);
        setAdminOrdersLoading(false);
      }
    };

    fetchAdminData();
  }, [isAdmin, orderStatusFilter]);

  const handleBookFieldChange = (field, value) => {
    setBookForm((current) => ({ ...current, [field]: value }));
  };

  const refreshAdminStats = async () => {
    try {
      const statsData = await adminService.getStats();
      setStats(statsData);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to refresh admin stats");
    }
  };

  const openAddBookModal = () => {
    setEditingBook(null);
    setBookForm(emptyBookForm);
    setIsBookModalOpen(true);
  };

  const openEditBookModal = (book) => {
    setEditingBook(book);
    setBookForm({
      title: book.title || "",
      author: book.author || "",
      price: book.price ?? "",
      category: book.category || "",
      image: book.image || "",
      stock: book.stock ?? "",
      genre: book.genre?.join(", ") || "",
      description: book.description || "",
      language: book.language || "English",
      pageCount: book.pageCount ?? "",
      publisher: book.publisher || "",
      releaseDate: book.releaseDate ? book.releaseDate.slice(0, 10) : "",
    });
    setIsBookModalOpen(true);
  };

  const closeBookModal = () => {
    setIsBookModalOpen(false);
    setEditingBook(null);
    setBookForm(emptyBookForm);
  };

  const buildBookPayload = () => ({
    ...bookForm,
    price: Number(bookForm.price),
    stock: Number(bookForm.stock || 0),
    pageCount: bookForm.pageCount ? Number(bookForm.pageCount) : undefined,
    releaseDate: bookForm.releaseDate || undefined,
    genre: bookForm.genre
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  });

  const handleSaveBook = async (event) => {
    event.preventDefault();
    setError("");
    setSavingBook(true);

    try {
      const payload = buildBookPayload();

      if (editingBook) {
        const updatedBook = await adminService.updateBook(editingBook._id, payload);
        setInventory((current) =>
          current.map((book) => (book._id === updatedBook._id ? updatedBook : book)),
        );
      } else {
        const createdBook = await adminService.addBook(payload);
        setInventory((current) => [createdBook, ...current]);
      }

      closeBookModal();
      refreshAdminStats();
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${editingBook ? "update" : "add"} book`);
    } finally {
      setSavingBook(false);
    }
  };

  const handleDeleteBook = async (book) => {
    const shouldDelete = window.confirm(`Delete "${book.title}" from the catalog?`);
    if (!shouldDelete) return;

    setError("");
    setDeletingBookId(book._id);

    try {
      await adminService.deleteBook(book._id);
      setInventory((current) => current.filter((item) => item._id !== book._id));
      refreshAdminStats();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete book");
    } finally {
      setDeletingBookId("");
    }
  };

  const handleOrderStatusChange = async (orderId, status) => {
    setError("");

    try {
      const updatedOrder = await orderService.updateOrderStatus(orderId, status);
      setAdminOrders((current) => {
        const nextOrders = current.map((order) =>
          order._id === orderId ? { ...updatedOrder, user: order.user } : order,
        );

        if (orderStatusFilter && status !== orderStatusFilter) {
          return nextOrders.filter((order) => order._id !== orderId);
        }

        return nextOrders;
      });
      refreshAdminStats();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update order status");
    }
  };

  const renderLibrary = () => (
    <div className="grid gap-6 md:grid-cols-2">
      {library.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm md:col-span-2">
          <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-md bg-slate-100 text-slate-700">
            <Library className="h-6 w-6" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-slate-950">
            Your library is waiting
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Start with a book from the catalog and your reading progress will
            appear here.
          </p>
          <Button
            className="mt-5"
            onClick={() => navigate("/catalog")}
          >
            Browse catalog
          </Button>
        </div>
      ) : (
        library.map((entry) => (
          <ProgressCard
            key={entry._id}
            title={entry.book?.title || "Untitled"}
            author={entry.book?.author || "Unknown author"}
            progress={entry.percentComplete || 0}
            pagesRead={entry.currentPage}
            totalPages={entry.totalPages || entry.book?.pageCount}
          />
        ))
      )}
    </div>
  );

  const renderWishlist = () => (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {wishlistLoading ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm sm:col-span-2 lg:col-span-4">
          Loading wishlist...
        </div>
      ) : wishlist.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm sm:col-span-2 lg:col-span-4">
          <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-md bg-amber-50 text-amber-700">
            <Heart className="h-6 w-6" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-slate-950">
            No saved books yet
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Save books from the catalog with the heart button and they will
            gather here.
          </p>
          <Button
            variant="secondary"
            className="mt-5"
            onClick={() => navigate("/catalog")}
          >
            Explore books
          </Button>
        </div>
      ) : (
        wishlist.map((book) => (
          <BookCard
            key={book._id}
            book={book}
            onQuickView={() => navigate(`/product/${book._id}`)}
          />
        ))
      )}
    </div>
  );

  const renderAdminOverview = () => (
    <>
      {stats && <AdminStats stats={stats} />}
      <div className="grid gap-4 md:grid-cols-3">
        <button
          onClick={() => setActiveTab("catalog")}
          className="rounded-lg border border-slate-200 bg-white p-6 text-left shadow-sm transition-colors hover:border-slate-400"
        >
          <div className="mb-4 grid h-10 w-10 place-items-center rounded-md bg-slate-100 text-slate-700">
            <BookOpen className="h-5 w-5" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
            Catalog
          </p>
          <p className="mt-2 font-serif text-xl font-bold text-slate-950">
            Manage books and stock
          </p>
          <p className="mt-3 text-sm text-slate-500">
            {inventory.length} titles loaded, {lowStockCount} low stock.
          </p>
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className="rounded-lg border border-slate-200 bg-white p-6 text-left shadow-sm transition-colors hover:border-slate-400"
        >
          <div className="mb-4 grid h-10 w-10 place-items-center rounded-md bg-amber-50 text-amber-700">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
            Orders
          </p>
          <p className="mt-2 font-serif text-xl font-bold text-slate-950">
            {totalAdminOrders} orders placed
          </p>
          <p className="mt-3 text-sm text-slate-500">
            Review customers and update fulfillment status.
          </p>
        </button>
        <button
          onClick={openAddBookModal}
          className="rounded-lg bg-slate-900 p-6 text-left text-white shadow-sm transition-colors hover:bg-slate-800"
        >
          <div className="mb-4 grid h-10 w-10 place-items-center rounded-md bg-white/10 text-white">
            <PackagePlus className="h-5 w-5" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/60">
            Quick action
          </p>
          <p className="mt-2 font-serif text-xl font-bold">Add a new book</p>
          <p className="mt-3 text-sm text-white/70">
            Create a fresh catalog entry for shoppers.
          </p>
        </button>
      </div>
      <AdminOrdersTable
        orders={adminOrders.slice(0, 5)}
        loading={adminOrdersLoading}
        totalOrders={totalAdminOrders}
        statusFilter={orderStatusFilter}
        onStatusFilterChange={setOrderStatusFilter}
        onStatusChange={handleOrderStatusChange}
      />
    </>
  );

  const renderAdminContent = () => {
    if (activeTab === "catalog") {
      return (
        <InventoryTable
          books={inventory}
          loading={inventoryLoading}
          onAddBook={openAddBookModal}
          onEditBook={openEditBookModal}
          onDeleteBook={handleDeleteBook}
          deletingBookId={deletingBookId}
        />
      );
    }

    if (activeTab === "orders") {
      return (
        <AdminOrdersTable
          orders={adminOrders}
          loading={adminOrdersLoading}
          totalOrders={totalAdminOrders}
          statusFilter={orderStatusFilter}
          onStatusFilterChange={setOrderStatusFilter}
          onStatusChange={handleOrderStatusChange}
        />
      );
    }

    return renderAdminOverview();
  };

  const renderReaderContent = () => {
    if (activeTab === "library") return renderLibrary();
    if (activeTab === "wishlist") return renderWishlist();
    if (activeTab === "orders") return <OrderHistory />;

    return (
      <>
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
              Library
            </p>
            <p className="mt-2 font-serif text-3xl font-bold text-slate-950">
              {library.length}
            </p>
            <p className="mt-1 text-sm text-slate-500">books in progress</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
              Wishlist
            </p>
            <p className="mt-2 font-serif text-3xl font-bold text-slate-950">
              {wishlist.length}
            </p>
            <p className="mt-1 text-sm text-slate-500">saved titles</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
              Account
            </p>
            <p className="mt-2 font-serif text-3xl font-bold text-slate-950">
              Active
            </p>
            <p className="mt-1 text-sm text-slate-500">reader profile</p>
          </div>
        </div>
        {renderLibrary()}
        <OrderHistory />
      </>
    );
  };

  return (
    <Layout>
      {error && (
        <div className="mb-6">
          <ErrorAlert message={error} onClose={() => setError("")} />
        </div>
      )}

      <section className="mb-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-md bg-slate-100 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-slate-600">
              <ShieldCheck className="h-4 w-4" />
              {isAdmin ? "Admin workspace" : "Reader workspace"}
            </div>
            <h1 className="font-serif text-4xl font-bold text-slate-950 sm:text-5xl">
              {isAdmin ? "Management Dashboard" : `Welcome back, ${firstName}`}
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
              {isAdmin
                ? "Keep the catalog, inventory, and customer orders moving from one focused workspace."
                : "Track your books, saved titles, and recent orders from your personal BookVerse shelf."}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {isAdmin && (
              <Button onClick={openAddBookModal}>
                <PackagePlus className="h-4 w-4" />
                Add book
              </Button>
            )}
            <Button
              variant="secondary"
              onClick={() => navigate("/catalog")}
            >
              <BookOpen className="h-4 w-4" />
              Browse catalog
            </Button>
          </div>
        </div>
      </section>

      <div className="mb-8 overflow-x-auto">
        <div className="inline-flex min-w-full gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-sm sm:min-w-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap rounded-md px-4 py-2.5 text-sm font-semibold transition-colors ${
                activeTab === tab.id
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-950"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {isAdmin ? renderAdminContent() : renderReaderContent()}

      <Modal
        isOpen={isBookModalOpen}
        title={editingBook ? "Edit Book" : "Add New Book"}
        onClose={closeBookModal}
        size="xl"
      >
        <form onSubmit={handleSaveBook} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            label="Title"
            value={bookForm.title}
            onChange={(event) => handleBookFieldChange("title", event.target.value)}
            required
          />
          <Input
            label="Author"
            value={bookForm.author}
            onChange={(event) => handleBookFieldChange("author", event.target.value)}
            required
          />
          <Input
            label="Price"
            type="number"
            min="0"
            step="0.01"
            value={bookForm.price}
            onChange={(event) => handleBookFieldChange("price", event.target.value)}
            required
          />
          <Input
            label="Category"
            value={bookForm.category}
            onChange={(event) => handleBookFieldChange("category", event.target.value)}
            required
          />
          <Input
            label="Cover Image URL"
            type="url"
            placeholder="https://example.com/book-cover.jpg"
            value={bookForm.image}
            onChange={(event) => handleBookFieldChange("image", event.target.value)}
          />
          <Input
            label="Stock"
            type="number"
            min="0"
            value={bookForm.stock}
            onChange={(event) => handleBookFieldChange("stock", event.target.value)}
          />
          <Input
            label="Genre"
            placeholder="Fiction, Mystery"
            value={bookForm.genre}
            onChange={(event) => handleBookFieldChange("genre", event.target.value)}
          />
          <Input
            label="Language"
            value={bookForm.language}
            onChange={(event) => handleBookFieldChange("language", event.target.value)}
          />
          <Input
            label="Page Count"
            type="number"
            min="0"
            value={bookForm.pageCount}
            onChange={(event) => handleBookFieldChange("pageCount", event.target.value)}
          />
          <Input
            label="Publisher"
            value={bookForm.publisher}
            onChange={(event) => handleBookFieldChange("publisher", event.target.value)}
          />
          <Input
            label="Release Date"
            type="date"
            value={bookForm.releaseDate}
            onChange={(event) => handleBookFieldChange("releaseDate", event.target.value)}
          />
          <label className="md:col-span-2 flex flex-col gap-1">
            <span className="text-sm font-semibold text-slate-700">Description</span>
            <textarea
              value={bookForm.description}
              onChange={(event) => handleBookFieldChange("description", event.target.value)}
              className="min-h-28 rounded border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </label>
          <div className="md:col-span-2 flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={closeBookModal}
              disabled={savingBook}
            >
              Cancel
            </Button>
            <Button type="submit" loading={savingBook}>
              {editingBook ? "Save Changes" : "Add Book"}
            </Button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}
