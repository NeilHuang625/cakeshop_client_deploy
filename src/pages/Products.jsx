import SortingSelector from "../components/SortingSelector";
import ListGridToggler from "../components/ListGridToggler";
import ProductCard from "../components/ProductCard";
import CategorySidebar from "../components/CategorySidebar";
import { useContext, useState } from "react";
import CakeContext from "../contexts/CakeContext";
import FilterDrawer from "../components/FilterDrawer";

const Products = () => {
  const useCake = useContext(CakeContext);
  const { cakes, categories } = useCake;

  const [view, setView] = useState("grid");
  const [sortBy, setSortBy] = useState("");
  const [category, setCategory] = useState("All");

  const handleChange = (event, nextView) => {
    if (nextView !== null) {
      setView(nextView);
    }
  };

  const handleSortByChange = (event, value) => {
    setSortBy(value);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const filteredCakes = cakes
    .filter((cake) => {
      if (category === "All") return true;
      if (category === "Specials") return cake.isPromoted;
      return cake.categoryId === category;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc")
        return a.cakeOptions[0].price - b.cakeOptions[0].price;
      if (sortBy === "price-desc")
        return b.cakeOptions[0].price - a.cakeOptions[0].price;
      return 0;
    });

  return (
    <div className="mx-auto mb-5 max-w-7xl px-3 py-5 sm:px-4">
      {/* sort by block */}
      <div className="flex items-center justify-between gap-4 md:justify-end">
        <div className="flex items-center md:hidden">
          <FilterDrawer
            handleCategoryChange={handleCategoryChange}
            categories={categories}
          />
        </div>
        <div className="flex items-center gap-4">
          <SortingSelector handleSortByChange={handleSortByChange} />
          <ListGridToggler view={view} handleChange={handleChange} />
        </div>
      </div>

      {/* main content */}
      <div className="mt-5 gap-4 border-t border-gray-200 md:grid md:grid-cols-[200px_1fr]">
        <div className="col-span-1 hidden border-r border-gray-200 pt-3 md:block">
          <CategorySidebar
            handleCategoryChange={handleCategoryChange}
            categories={categories}
          />
        </div>
        <div className="col-span-1 mt-3">
          <div
            className={`grid gap-3 sm:gap-5 ${view === "grid" ? "grid-930 grid-1140 grid-cols-2 sm:grid-cols-3 md:grid-cols-2" : "grid-cols-1"}`}
          >
            {filteredCakes.length === 0 ? (
              <div>No cakes found</div>
            ) : (
              filteredCakes.map((cake) => (
                <ProductCard key={cake.id} cake={cake} view={view} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Products;
