import { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "./AuthProvider";
import { getOrders } from "../services/apiOrder";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { jwt } = useContext(AuthContext);

  useEffect(() => {
    if (!jwt) return setIsLoading(false);

    const fetchOrders = async () => {
      const res = await getOrders(jwt);
      if (res.success) {
        setOrders(res.data);
      } else {
        console.log(res);
      }
      setIsLoading(false);
    };

    fetchOrders();
  }, [jwt]);

  return (
    <OrderContext.Provider value={{ orders, setOrders, isLoading }}>
      {children}
    </OrderContext.Provider>
  );
};

OrderProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default OrderContext;
