import BannerSwiper from "../components/BannerSwiper";
import CakeSwiper from "../components/CakeSwiper";
import Special from "../components/Special";

const Home = () => {
  return (
    <div className="mx-auto mt-4 max-w-7xl py-1 sm:py-3">
      {/* banner */}
      <BannerSwiper />

      <Special />

      <CakeSwiper>Fresh Cakes</CakeSwiper>
      <CakeSwiper>Desserts & Snacks</CakeSwiper>
    </div>
  );
};

export default Home;
