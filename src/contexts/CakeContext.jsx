import { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getAllCakes, getAvailableCakes } from "../services/apiCake";
import { AuthContext } from "./AuthProvider";

const CakeContext = createContext();

export const CakeProvider = ({ children }) => {
  const [cakes, setCakes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  const { user, jwt } = useContext(AuthContext);

  // Initialize cakes and categories state on app load
  useEffect(() => {
    const fetchCakes = async () => {
      try {
        const res =
          user?.role === "admin"
            ? await getAllCakes(jwt)
            : await getAvailableCakes();
        if (res.success) {
          setCakes(res.data.cakes);
          setCategories(res.data.categories);
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error:", error.message);
        setIsLoading(false);
      }
    };
    fetchCakes();
  }, [user, jwt]);

  return (
    <CakeContext.Provider
      value={{
        cakes,
        setCakes,
        isLoading,
        categories,
      }}
    >
      {children}
    </CakeContext.Provider>
  );
};

CakeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CakeContext;
