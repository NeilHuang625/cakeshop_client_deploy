import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "./CakeSwiper.css";
import { Navigation } from "swiper/modules";
import { useContext } from "react";
import CakeContext from "../contexts/CakeContext";
import PropTypes from "prop-types";
import { IoBagCheckOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const CakeSwiper = ({ children }) => {
  const { cakes } = useContext(CakeContext);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 pb-10 sm:p-8">
      <div className="flex items-center justify-center gap-5">
        <div className="h-1 w-30 rounded-full bg-yellow-500"></div>
        <h1 className="text-center text-xl font-bold tracking-widest text-gray-700">
          {children}
        </h1>
        <div className="h-1 w-30 rounded-full bg-yellow-500"></div>
      </div>
      <Swiper
        slidesPerView={1}
        spaceBetween={58}
        modules={[Navigation]}
        breakpoints={{
          580: {
            slidesPerView: 2,
            spaceBetween: 58,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 35,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 40,
          },
        }}
        navigation
        className="cake-swiper"
      >
        {cakes.map((cake) => (
          <SwiperSlide
            key={cake.id}
            className="hover:cursor-pointer hover:shadow-lg"
          >
            <div onClick={() => navigate(`/cakes/${cake.id}`)}>
              <img src={cake.cakeImages[0]} alt={cake.cakeName} />
              <div className="flex flex-col justify-center gap-1 px-8 pt-4 pb-8 sm:p-4">
                <p className="cake-name font-bold text-gray-700">
                  {cake.cakeName}
                </p>
                <p className="font-bold text-gray-700">
                  ${cake.cakeOptions[0].price}
                </p>

                <button className="flex items-center justify-center gap-1 rounded-lg bg-amber-500 px-4 py-2 text-sm text-white transition-all duration-200 hover:cursor-pointer hover:bg-amber-600">
                  <IoBagCheckOutline className="h-4.5 w-4.5" />
                  Add to Cart
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

CakeSwiper.propTypes = {
  children: PropTypes.string,
};

export default CakeSwiper;
