import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthProvider";
import PropTypes from "prop-types";
import { getCarts } from "../services/apiCart";

const CartContext = createContext();

export const CartContextProvider = ({ children }) => {
  const [carts, setCarts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { jwt } = useContext(AuthContext);

  useEffect(() => {
    if (!jwt) return setIsLoading(false);

    const fetchCarts = async () => {
      const res = await getCarts(jwt);
      if (res.success) {
        setCarts(res.data);
        setIsLoading(false);
      } else {
        console.error("Error:", res.message);
        setIsLoading(false);
      }
    };

    fetchCarts();
  }, [jwt]);

  return (
    <CartContext.Provider value={{ carts, setCarts, isLoading }}>
      {children}
    </CartContext.Provider>
  );
};

CartContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CartContext;
