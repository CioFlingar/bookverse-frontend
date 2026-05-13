// src/features/dashboard/InventoryTable.jsx
import { useMemo, useState } from "react";
import { Search } from "lucide-react";

export default function InventoryTable({
  books = [],
  loading = false,
  onAddBook,
  onEditBook,
  onDeleteBook,
  deletingBookId = "",
}) {
  const [search, setSearch] = useState("");
  const visibleBooks = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return books;

    return books.filter((book) =>
      [
        book.title,
        book.author,
        book.category,
        book.genre?.join(" "),
        book.publisher,
      ]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query)),
    );
  }, [books, search]);

  return (
    <div className="mt-12 bg-white border border-gray-100 p-8">
      <div className="flex flex-col gap-4 mb-8 md:flex-row md:items-center md:justify-between">
        <h3 className="text-xl font-serif">Manage Catalog</h3>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search inventory..."
              className="w-full border border-gray-200 py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 sm:w-64"
            />
          </div>
          <button
            onClick={onAddBook}
            className="bg-verse-dark text-white px-4 py-2 text-[10px] uppercase tracking-widest font-bold hover:bg-slate-700 transition-colors"
          >
            + Add New Book
          </button>
        </div>
      </div>
      <table className="w-full text-left">
        <thead>
          <tr className="text-[10px] uppercase text-gray-400 border-b border-gray-100">
            <th className="pb-4">Book Title</th>
            <th className="pb-4">Category</th>
            <th className="pb-4">Stock</th>
            <th className="pb-4">Price</th>
            <th className="pb-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="5" className="py-8 text-center text-sm text-gray-400">
                Loading inventory...
              </td>
            </tr>
          ) : visibleBooks.length === 0 ? (
            <tr>
              <td colSpan="5" className="py-8 text-center text-sm text-gray-400">
                {search ? "No books match your search." : "No books in the catalog yet."}
              </td>
            </tr>
          ) : (
            visibleBooks.map((item) => (
              <tr key={item._id} className="border-b border-gray-50 last:border-0">
                <td className="py-4">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-gray-400">{item.author}</p>
                </td>
                <td className="py-4 text-sm text-gray-500">{item.category || "Uncategorized"}</td>
                <td className="py-4">
                  <span className={`text-[10px] font-bold ${item.stock < 5 ? "text-red-500" : "text-gray-500"}`}>
                    {item.stock < 5 ? `Low Stock (${item.stock})` : `${item.stock} in stock`}
                  </span>
                </td>
                <td className="py-4 text-sm">${Number(item.price || 0).toFixed(2)}</td>
                <td className="py-4">
                  <div className="flex justify-end gap-4 text-[10px] uppercase font-bold">
                    <button
                      onClick={() => onEditBook(item)}
                      disabled={deletingBookId === item._id}
                      className="text-slate-700 underline underline-offset-4 hover:text-slate-950"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDeleteBook(item)}
                      disabled={deletingBookId === item._id}
                      className="text-red-500 underline underline-offset-4 hover:text-red-700"
                    >
                      {deletingBookId === item._id ? "Deleting" : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
