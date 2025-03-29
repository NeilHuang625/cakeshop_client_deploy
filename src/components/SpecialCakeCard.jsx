import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const SpecialCakeCard = ({ cake }) => {
  const navigate = useNavigate();

  return (
    <div className="flex h-full w-full items-center justify-around gap-4 rounded-lg bg-gray-950 px-6 py-5 sm:px-10 sm:py-4">
      <div className="flex-grow space-y-1.5">
        <p className="text-red-500">[Special]</p>
        <p className="text-lg text-white">{cake.cakeName}</p>
        <p className="text-lg text-white">${cake.cakeOptions[0].price}</p>
        <button
          onClick={() => navigate(`/cakes/${cake.id}`)}
          className="mt-2 rounded-lg bg-amber-500 px-4 py-2 text-sm text-gray-100 transition-all duration-200 hover:cursor-pointer hover:bg-amber-600"
        >
          Shop Now
        </button>
      </div>
      <img
        src={cake.cakeImages[0]}
        className="w-1/2 transition-all duration-300 hover:scale-105"
        alt="cake image"
      />
    </div>
  );
};

SpecialCakeCard.propTypes = {
  cake: PropTypes.object.isRequired,
};

export default SpecialCakeCard;
