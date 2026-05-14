import { useState } from "react";
import {
  BookOpen,
  Heart,
  LogOut,
  Menu,
  Search,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { useWishlist } from "../hooks/useWishlist";

const getNavLinkClass = ({ isActive }) =>
  [
    "rounded-md px-3 py-2 text-sm font-semibold transition-colors",
    isActive
      ? "bg-slate-900 text-white shadow-sm"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
  ].join(" ");

export default function Navbar() {
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const { user, logout, isAuthenticated } = useAuth();
  const [search, setSearch] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate("/");
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const query = search.trim();
    setIsMenuOpen(false);
    navigate(query ? `/catalog?search=${encodeURIComponent(query)}` : "/catalog");
  };

  const closeMenu = () => setIsMenuOpen(false);

  const navLinks = [
    { to: "/", label: "Home", end: true },
    { to: "/catalog", label: "Catalog" },
    ...(isAuthenticated ? [{ to: "/dashboard", label: "Dashboard" }] : []),
  ];

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/85 md:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-6">
          <Link
            to="/"
            onClick={closeMenu}
            className="group flex items-center gap-2 text-slate-950"
          >
            <span className="grid h-10 w-10 place-items-center rounded-md bg-slate-900 text-white shadow-sm transition-colors group-hover:bg-amber-700">
              <BookOpen className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block font-serif text-2xl font-bold italic leading-none tracking-tight">
                BookVerse
              </span>
              <span className="hidden text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 sm:block">
                Curated bookstore
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={getNavLinkClass}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <form onSubmit={handleSearchSubmit} className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search the collection..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-10 w-72 rounded-md border border-slate-200 bg-slate-50 pl-10 pr-9 text-sm text-slate-900 transition focus:border-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md text-slate-400 hover:text-slate-700"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </form>

          <div className="flex items-center gap-1 text-slate-800 sm:gap-2">
            {isAuthenticated && (
              <Link
                to="/wishlist"
                onClick={closeMenu}
                className="relative rounded-md p-2 transition-colors hover:bg-slate-100 hover:text-slate-950"
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-600 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                    {wishlistCount > 99 ? "99+" : wishlistCount}
                  </span>
                )}
              </Link>
            )}
            <Link
              to="/cart"
              onClick={closeMenu}
              className="relative rounded-md p-2 transition-colors hover:bg-slate-100 hover:text-slate-950"
              aria-label="Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Link>
            <div className="hidden items-center gap-3 border-l border-slate-200 pl-3 sm:flex">
              {isAuthenticated ? (
                <>
                  <span className="max-w-32 truncate text-sm font-medium text-slate-600">
                    {user?.name || "Reader"}
                  </span>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-md p-2 transition-colors hover:bg-slate-100 hover:text-slate-950"
                    title="Logout"
                    aria-label="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="rounded-md p-2 transition-colors hover:bg-slate-100 hover:text-slate-950"
                  aria-label="Login"
                >
                  <User className="h-5 w-5" />
                </Link>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsMenuOpen((current) => !current)}
              className="rounded-md p-2 transition-colors hover:bg-slate-100 hover:text-slate-950 md:hidden"
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSearchSubmit} className="relative mx-auto mt-3 max-w-7xl lg:hidden">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search the collection..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 pl-10 pr-9 text-sm text-slate-900 transition focus:border-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md text-slate-400 hover:text-slate-700"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      {isMenuOpen && (
        <div className="mx-auto mt-3 max-w-7xl border-t border-slate-200 pt-3 md:hidden">
          <div className="grid gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={closeMenu}
                className={getNavLinkClass}
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="mt-3 border-t border-slate-200 pt-3 sm:hidden">
            {isAuthenticated ? (
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {user?.name || "Reader"}
                  </p>
                  <p className="text-xs text-slate-500">Signed in</p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-900 hover:text-slate-950"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={closeMenu}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
              >
                <User className="h-4 w-4" />
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
