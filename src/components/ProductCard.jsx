import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { RiShoppingCartLine } from "react-icons/ri";
import AddToCartDialog from "./AddToCartDialog";
import { useState } from "react";

const ProductCard = ({ cake, view }) => {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <div
      onClick={() => navigate(`/cakes/${cake.id}`)}
      className={`overflow-hidden rounded-lg bg-gray-100 shadow-lg hover:shadow-2xl ${
        view === "list" ? "flex" : ""
      } border border-gray-200/50 transition-all duration-300 hover:scale-103 hover:cursor-pointer hover:border-gray-300 hover:bg-gray-300`}
    >
      <div
        className={`relative ${view === "list" ? "sm:w-1/4 md:w-1/5" : "1/3"} `}
      >
        <img
          src={cake.cakeImages[0]}
          alt="product"
          className={`${view === "list" ? "h-44" : "h-48"} w-full object-cover`}
        />
        {cake.isPromoted && (
          <div className="absolute top-0 left-0 bg-red-500 px-2 py-1 text-white">
            20% OFF
          </div>
        )}
      </div>
      <div className={`p-3 ${view === "list" ? "w-4/5" : ""}`}>
        <h3
          className={`${view === "list" ? "" : "line-clamp-2 min-h-[3.5rem]"} text-sm font-semibold text-gray-900 hover:text-blue-500 sm:text-lg`}
        >
          {cake.cakeName}
        </h3>
        {view === "list" && (
          <p className="mt-1 line-clamp-3 text-sm text-gray-700 sm:text-base">
            {cake.cakeDescription}
          </p>
        )}
        <div className="mt-0 flex flex-720 flex-col items-center justify-between gap-1 sm:mt-3 sm:gap-0">
          <span className="font-semibold text-gray-900">
            NZ$ {cake.cakeOptions[0].price}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpenDialog(true);
            }}
            className="flex w-full items-center justify-center gap-1 rounded-lg bg-yellow-600 px-3 py-2 text-sm text-white hover:cursor-pointer hover:bg-amber-600 sm:w-auto"
          >
            <RiShoppingCartLine className="h-4 w-4" />
            Add to Cart
          </button>

          {openDialog && (
            <AddToCartDialog
              cake={cake}
              open={openDialog}
              handleClose={() => setOpenDialog(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  cake: PropTypes.object.isRequired,
  view: PropTypes.string.isRequired,
};

export default ProductCard;
