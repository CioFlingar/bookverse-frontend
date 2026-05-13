// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import OrderHistory from "../features/dashboard/OrderHistory";
import ProgressCard from "../features/dashboard/ProgressCard";
import { authService } from "../services/authService";
import { libraryService } from "../services/libraryService";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [library, setLibrary] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (!userInfo?.token) return navigate("/login");

      try {
        const [profile, libraryData] = await Promise.all([
          authService.getProfile(),
          libraryService.getUserLibrary({ limit: 4 }),
        ]);

        setUser(profile);
        setLibrary(libraryData.books || []);
      } catch {
        localStorage.removeItem("userInfo");
        navigate("/login");
      }
    };

    fetchDashboardData();
  }, [navigate]);

  return (
    <Layout>
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-serif text-verse-dark">
            Reading Dashboard
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {user?.role === "admin" ? "Management Console" : "Your Library"}
          </p>
        </div>
        <div className="flex gap-4">
          <button className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Library
          </button>
          <button className="text-xs font-bold uppercase tracking-widest text-verse-dark border-b border-verse-dark">
            Overview
          </button>
        </div>
      </div>

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

      <OrderHistory />
    </Layout>
  );
}
