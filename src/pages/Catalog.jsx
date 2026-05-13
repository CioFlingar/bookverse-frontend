// src/pages/Catalog.jsx
import Layout from '../components/Layout';
import Sidebar from '../features/catalog/Sidebar';
import CatalogGrid from '../features/catalog/CatalogGrid';

export default function Catalog() {
  return (
    <Layout>
      <div className="flex flex-col md:flex-row gap-12">
        <Sidebar />
        <CatalogGrid />
      </div>
    </Layout>
  );
}