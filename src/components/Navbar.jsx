import { useState } from "react";
import { Heart, LogOut, Search, ShoppingCart, User, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { useWishlist } from "../hooks/useWishlist";

export default function Navbar() {
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const { user, logout, isAuthenticated } = useAuth();
  const [search, setSearch] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const query = search.trim();
    navigate(query ? `/catalog?search=${encodeURIComponent(query)}` : "/catalog");
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 px-4 py-4 shadow-sm backdrop-blur md:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Branding */}
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="text-2xl font-serif font-bold italic tracking-tight text-slate-900 hover:text-slate-600"
          >
            BookVerse
          </Link>

          {/* Main Links */}
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-500">
            <Link to="/" className="hover:text-slate-900 transition-colors">
              Home
            </Link>
            <Link
              to="/catalog"
              className="hover:text-slate-900 transition-colors"
            >
              Catalog
            </Link>
            {isAuthenticated && (
              <Link
                to="/dashboard"
                className="hover:text-slate-900 transition-colors"
              >
                Dashboard
              </Link>
            )}
          </div>
        </div>

        {/* Search and Icons */}
        <div className="flex items-center gap-6">
          <form onSubmit={handleSearchSubmit} className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search the collection..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-72 rounded-md border border-slate-200 bg-slate-50 py-2 pl-10 pr-9 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-slate-700"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>
          <div className="flex gap-4 text-slate-800 items-center">
            {isAuthenticated && (
              <Link
                to="/wishlist"
                className="relative rounded-md p-2 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {wishlistCount > 99 ? "99+" : wishlistCount}
                  </span>
                )}
              </Link>
            )}
            <Link
              to="/cart"
              className="relative rounded-md p-2 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Link>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              {isAuthenticated ? (
                <>
                  <span className="hidden text-sm text-slate-600 sm:inline">
                    {user?.name || "User"}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="rounded-md p-2 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="rounded-md p-2 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                >
                  <User className="w-5 h-5" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      <form onSubmit={handleSearchSubmit} className="relative mx-auto mt-4 max-w-7xl lg:hidden">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search the collection..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full rounded-md border border-slate-200 bg-slate-50 py-2 pl-10 pr-9 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-slate-700"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>
    </nav>
  );
}
