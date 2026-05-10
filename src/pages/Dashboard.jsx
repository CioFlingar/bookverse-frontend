// src/pages/Dashboard.jsx
import Layout from "../components/Layout";
import OrderHistory from "../features/dashboard/OrderHistory";
import ProgressCard from "../features/dashboard/ProgressCard";

export default function Dashboard() {
  return (
    <Layout>
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-serif text-verse-dark">
            Reading Dashboard{" "}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Management Console
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
