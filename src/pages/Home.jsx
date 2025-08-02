import BannerSwiper from "../components/BannerSwiper";
import CakeSwiper from "../components/CakeSwiper";
import Special from "../components/Special";
import { useContext } from "react";
import CategoryContext from "../contexts/CategoryContext";

const Home = () => {
  const { categories } = useContext(CategoryContext);

  // Find category IDs by category names (with safety check)
  const cakeCategory = categories?.find(cat => cat.categoryName === "Cake");
  const dessertCategory = categories?.find(cat => cat.categoryName === "Desserts&Snacks");

  return (
    <div className="mx-auto mt-4 max-w-7xl py-1 sm:py-3">
      <BannerSwiper />

      <Special />

      {cakeCategory && (
        <CakeSwiper categoryId={cakeCategory.id}>Fresh Cakes</CakeSwiper>
      )}
      {dessertCategory && (
        <CakeSwiper categoryId={dessertCategory.id}>Desserts & Snacks</CakeSwiper>
      )}
    </div>
  );
};

export default Home;
