// components/SwiperComponent.jsx
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/scrollbar";
import "swiper/css/pagination";
import "./BannerSwiper.css";
import { Autoplay, Pagination } from "swiper/modules";

const bannerImages = [
  "/banner/banner1.jpg",
  "/banner/banner2.jpg",
  // Add more banner images here
];

const BannerSwiper = () => {
  return (
    <Swiper
      spaceBetween={15}
      pagination={{
        clickable: true,
        dynamicBullets: true,
      }}
      modules={[Pagination, Autoplay]}
      autoplay={{
        delay: 4500,
        disableOnInteraction: false,
      }}
      loop
      className="banner-swiper"
    >
      {bannerImages.map((image, index) => (
        <SwiperSlide key={index}>
          <img src={image} alt={`Banner ${index + 1}`} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default BannerSwiper;
