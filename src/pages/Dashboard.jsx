// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
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
    <div className="grid md:grid-cols-2 gap-8">
      {library.length === 0 ? (
        <div className="md:col-span-2 bg-white border border-gray-100 p-6 text-sm text-gray-500">
          Your library is waiting for its first book.
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
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-500 sm:col-span-2 lg:col-span-4">
          Loading wishlist...
        </div>
      ) : wishlist.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-500 sm:col-span-2 lg:col-span-4">
          Your wishlist is empty. Save books from the catalog with the heart button.
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
      <div className="grid md:grid-cols-3 gap-4">
        <button
          onClick={() => setActiveTab("catalog")}
          className="bg-white border border-gray-100 p-6 text-left hover:border-slate-300 transition-colors"
        >
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-2">
            Catalog
          </p>
          <p className="font-serif text-xl text-verse-dark">Manage books and stock</p>
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className="bg-white border border-gray-100 p-6 text-left hover:border-slate-300 transition-colors"
        >
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-2">
            Orders
          </p>
          <p className="font-serif text-xl text-verse-dark">{totalAdminOrders} orders placed</p>
        </button>
        <button
          onClick={openAddBookModal}
          className="bg-verse-dark text-white p-6 text-left hover:bg-slate-700 transition-colors"
        >
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/60 font-bold mb-2">
            Quick Action
          </p>
          <p className="font-serif text-xl">Add a new book</p>
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

      <div className="mb-10 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-serif text-verse-dark">
            {isAdmin ? "Management Dashboard" : "Reading Dashboard"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {isAdmin ? "Catalog and inventory controls" : "Your Library"}
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-xs font-bold uppercase tracking-widest pb-1 transition-colors ${
                activeTab === tab.id
                  ? "text-verse-dark border-b border-verse-dark"
                  : "text-gray-400 hover:text-slate-700"
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
        <form onSubmit={handleSaveBook} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <span className="text-sm font-semibold text-gray-700">Description</span>
            <textarea
              value={bookForm.description}
              onChange={(event) => handleBookFieldChange("description", event.target.value)}
              className="min-h-28 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
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
