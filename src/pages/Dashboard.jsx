// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/client";
import Layout from "../components/Layout";
import OrderHistory from "../features/dashboard/OrderHistory";
import ProgressCard from "../features/dashboard/ProgressCard";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (!userInfo?.token) return navigate("/login");

      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        const response = await apiClient.get("/users/profile", config);
        setUser(response.data);
      } catch (err) {
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
            Reading Dashboard{" "}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Management Console [cite: 139, 184]
          </p>
        </div>
        <div className="flex gap-4">
          <button className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Library [cite: 156]
          </button>
          <button className="text-xs font-bold uppercase tracking-widest text-verse-dark border-b border-verse-dark">
            Overview [cite: 190]
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <ProgressCard
          title="Meditations"
          author="Marcus Aurelius"
          progress={24}
        />
        <ProgressCard
          title="The Architecture of Happiness"
          author="Alain de Botton"
          progress={68}
          pagesRead={182}
          totalPages={268}
        />
      </div>

      <OrderHistory />
    </Layout>
  );
}
