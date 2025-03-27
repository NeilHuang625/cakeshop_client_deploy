import { Divider } from "@mui/material";
import PropTypes from "prop-types";

const OrderItem = ({ item, isLast }) => {
  const { cakePrice, cakeName, cakeSize, cakeImage, quantity } = item;

  return (
    <>
      <div className="flex items-center justify-between gap-4 py-2 sm:grid sm:grid-cols-4">
        {/* pic and name */}
        <div className="flex items-center gap-6 sm:col-span-2">
          <img
            src={cakeImage}
            alt="product"
            className="h-20 w-20 rounded-lg object-cover"
          />
          <div>
            <h1 className="text-lg font-semibold">{cakeName}</h1>
            <p>{cakeSize}</p>
          </div>
        </div>

        {/* quantity and unit price */}
        <div className="justify-between gap-4 space-y-6 sm:col-span-2 sm:flex sm:items-center sm:space-y-0">
          <div className="flex items-center justify-end gap-2">
            <p className="text-sm text-gray-700">{quantity}</p>
            <span>x</span>
            <p className="text-sm text-gray-700">NZ$ {cakePrice}</p>
          </div>

          {/* total price */}
          <div className="flex items-center justify-end">
            <p className="text-sm font-semibold">NZ$ {cakePrice * quantity}</p>
          </div>
        </div>
      </div>
      {!isLast && <Divider />}
    </>
  );
};

OrderItem.propTypes = {
  item: PropTypes.object.isRequired,
  cakes: PropTypes.array.isRequired,
  isLast: PropTypes.bool.isRequired,
};

export default OrderItem;
