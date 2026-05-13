import Layout from "../components/Layout";
import ProductDetail from "../features/product/ProductDetail";
import Reviews from "../features/product/Reviews";

export default function Product() {
  return (
    <Layout>
      <ProductDetail />
      <Reviews />
    </Layout>
  );
}
