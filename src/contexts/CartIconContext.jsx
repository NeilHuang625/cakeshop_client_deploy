import { createContext, useRef } from "react";
import PropTypes from "prop-types";

const CartIconContext = createContext();

export const CartIconProvider = ({ children }) => {
  const cartIconRef = useRef(null);
  const cakeDetailPageImageRef = useRef(null);
  const addToCartDialogImageRef = useRef(null);

  return (
    <CartIconContext.Provider
      value={{ cartIconRef, cakeDetailPageImageRef, addToCartDialogImageRef }}
    >
      {children}
    </CartIconContext.Provider>
  );
};

CartIconProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CartIconContext;
