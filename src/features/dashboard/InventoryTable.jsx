// src/features/dashboard/InventoryTable.jsx
import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";

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
    <div className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="font-serif text-2xl font-bold text-slate-950">
            Manage Catalog
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Search, edit, and keep stock levels current.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search inventory..."
              className="h-10 w-full rounded-md border border-slate-200 py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 sm:w-64"
            />
          </div>
          <button
            onClick={onAddBook}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-slate-900 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            Add Book
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100 text-xs uppercase tracking-[0.16em] text-slate-400">
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
                <td colSpan="5" className="py-8 text-center text-sm text-slate-400">
                  Loading inventory...
                </td>
              </tr>
            ) : visibleBooks.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-sm text-slate-400">
                  {search ? "No books match your search." : "No books in the catalog yet."}
                </td>
              </tr>
            ) : (
              visibleBooks.map((item) => (
                <tr key={item._id} className="border-b border-slate-50 last:border-0">
                  <td className="py-4">
                    <p className="font-semibold text-slate-900">{item.title}</p>
                    <p className="text-xs text-slate-400">{item.author}</p>
                  </td>
                  <td className="py-4 text-sm text-slate-500">{item.category || "Uncategorized"}</td>
                  <td className="py-4">
                    <span className={`rounded-full px-2 py-1 text-xs font-bold ${item.stock < 5 ? "bg-red-50 text-red-700" : "bg-slate-100 text-slate-600"}`}>
                      {item.stock < 5 ? `Low Stock (${item.stock})` : `${item.stock} in stock`}
                    </span>
                  </td>
                  <td className="py-4 text-sm font-semibold text-slate-700">${Number(item.price || 0).toFixed(2)}</td>
                  <td className="py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onEditBook(item)}
                        disabled={deletingBookId === item._id}
                        className="rounded-md px-3 py-1.5 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950 disabled:opacity-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDeleteBook(item)}
                        disabled={deletingBookId === item._id}
                        className="rounded-md px-3 py-1.5 text-xs font-bold text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
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
    </div>
  );
}
