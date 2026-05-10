import { Search, ShoppingCart, User } from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="border-b border-gray-200 bg-white px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Branding [cite: 1, 34] */}
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-serif font-bold tracking-tight text-verse-dark">
            BookVerse
          </h1>

          {/* Main Links [cite: 40] */}
          <div className="hidden md:flex gap-6 text-sm font-medium text-gray-500">
            <Link to="/" className="hover:text-verse-dark transition-colors">
              Home
            </Link>
            <Link
              to="/catalog"
              className="text-verse-dark border-b-2 border-verse-dark"
            >
              Catalog
            </Link>
            <Link
              to="/dashboard"
              className="hover:text-verse-dark transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>

        {/* Search and Icons [cite: 3, 41] */}
        <div className="flex items-center gap-6">
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search the collection..."
              className="pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm w-64 focus:outline-none focus:ring-1 focus:ring-gray-300"
            />
          </div>
          <div className="flex gap-4 text-verse-dark">
            <ShoppingCart className="w-5 h-5 cursor-pointer" />
            <User className="w-5 h-5 cursor-pointer" />
          </div>
        </div>
      </div>
    </nav>
  );
}
