import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getAllCategories } from "../services/apiCategory";

const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize categories state on app load
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategories();
        if (res.success) {
          setCategories(res.data);
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error:", error.message);
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <CategoryContext.Provider
      value={{
        categories,
        setCategories,
        isLoading,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

CategoryProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CategoryContext;
