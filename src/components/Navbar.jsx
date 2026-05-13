import { LogOut, Search, ShoppingCart, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";

export default function Navbar() {
  const navigate = useNavigate();
  const { items } = useCart();
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="border-b border-gray-200 bg-white px-8 py-4 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Branding */}
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="text-2xl font-serif font-bold italic tracking-tight text-slate-800 hover:text-slate-600"
          >
            BookVerse
          </Link>

          {/* Main Links */}
          <div className="hidden md:flex gap-6 text-sm font-medium text-gray-500">
            <Link to="/" className="hover:text-slate-800 transition-colors">
              Home
            </Link>
            <Link
              to="/catalog"
              className="hover:text-slate-800 transition-colors"
            >
              Catalog
            </Link>
            {isAuthenticated && (
              <Link
                to="/dashboard"
                className="hover:text-slate-800 transition-colors"
              >
                Dashboard
              </Link>
            )}
          </div>
        </div>

        {/* Search and Icons */}
        <div className="flex items-center gap-6">
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search the collection..."
              className="pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm w-64 focus:outline-none focus:ring-1 focus:ring-gray-300"
            />
          </div>
          <div className="flex gap-4 text-slate-800 items-center">
            <Link
              to="/cart"
              className="relative hover:text-slate-600 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </Link>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              {isAuthenticated ? (
                <>
                  <span className="text-sm text-gray-600">
                    {user?.name || "User"}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="hover:text-slate-600 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="hover:text-slate-600 transition-colors"
                >
                  <User className="w-5 h-5" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
