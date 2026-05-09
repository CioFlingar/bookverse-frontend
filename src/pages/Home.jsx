import Layout from "../components/Layout";
import CategoryGrid from "../features/home/CategoryGrid";
import Hero from "../features/home/Hero";
import Quote from "../features/home/Quote";
import Trending from "../features/home/Trending";

export default function Home() {
  return (
    <Layout>
      <Hero />
      <CategoryGrid />
      <Trending />
      <Quote />
    </Layout>
  );
}
