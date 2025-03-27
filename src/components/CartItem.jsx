import PropTypes from "prop-types";
import CartQuantityInput from "./CartQuantityInput";
import { Divider } from "@mui/material";
import { RxCrossCircled } from "react-icons/rx";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthProvider";
import CartContext from "../contexts/CartContext";
import { deleteCart } from "../services/apiCart";
import CakeContext from "../contexts/CakeContext";
import { CgUnavailable } from "react-icons/cg";
import { isCakeAvailable } from "../utils";

const CartItem = ({ cart }) => {
  const { jwt, user } = useContext(AuthContext);
  const { carts, setCarts } = useContext(CartContext);
  const { cakes } = useContext(CakeContext);

  const handleCartDelete = async () => {
    const result = await deleteCart(cart.id, jwt);
    if (result.success) {
      const updatedCarts = carts.filter((c) => c.id !== cart.id);
      setCarts(updatedCarts);
    } else {
      console.error("Error deleting cart");
    }
  };

  // Check if the cake in the cart is still available
  const cakeAvailable = isCakeAvailable(user.role, cakes, cart);

  return (
    <div>
      <div className="p-3">
        <div className="relative flex gap-5">
          <img
            src={cart.cakeImage}
            alt="product"
            className={`h-20 w-20 rounded-lg object-cover ${
              !cakeAvailable && "opacity-50"
            }`}
          />
          {!cakeAvailable && (
            <CgUnavailable className="absolute h-20 w-20 text-white" />
          )}
          <RxCrossCircled
            onClick={handleCartDelete}
            className="absolute -top-2.5 left-17 h-6 w-6 rounded-full bg-white text-red-900 transition duration-150 hover:scale-105 hover:cursor-pointer hover:bg-red-500 hover:text-white sm:-top-2 sm:h-5 sm:w-5"
          />

          <div
            className={`${!cakeAvailable && "opacity-50"} flex w-full flex-col justify-between`}
          >
            <div>
              <h1 className="text-lg font-semibold">{cart.cakeName}</h1>
              <p>{cart.cakeSize}</p>
            </div>

            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-700">{cart.quantity}</p>
                <span>x</span>
                <p className="text-sm text-gray-700">NZ$ {cart.cakePrice}</p>
              </div>
              <div>{cakeAvailable && <CartQuantityInput cart={cart} />}</div>
            </div>
          </div>
        </div>
      </div>
      <Divider />
    </div>
  );
};

CartItem.propTypes = {
  cart: PropTypes.object.isRequired,
};

export default CartItem;
