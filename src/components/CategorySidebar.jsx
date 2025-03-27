import PropTypes from "prop-types";

const CategorySidebar = ({ handleCategoryChange, categories }) => {
  return (
    <>
      <h2 className="text-md font-semibold text-gray-700">Categories</h2>
      <form className="mt-3 flex flex-col gap-2 text-gray-500">
        <div className="flex items-center gap-2">
          <input
            className="hover:cursor-pointer hover:text-gray-700"
            type="radio"
            id="all"
            name="category"
            value="All"
            onChange={handleCategoryChange}
          />
          <label htmlFor="all">All</label>
        </div>
        <div className="flex items-center gap-2">
          <input
            className="hover:cursor-pointer hover:text-gray-700"
            type="radio"
            id="specials"
            name="category"
            value="Specials"
            onChange={handleCategoryChange}
          />
          <label htmlFor="specials">Specials</label>
        </div>
        {categories.map((category) => (
          <div className="flex items-center gap-2" key={category.id}>
            <input
              className="hover:cursor-pointer hover:text-gray-700"
              type="radio"
              id={category.categoryName}
              name="category"
              value={category.id}
              onChange={handleCategoryChange}
            />
            <label htmlFor={category.categoryName}>
              {category.categoryName}
            </label>
          </div>
        ))}
      </form>
    </>
  );
};

CategorySidebar.propTypes = {
  handleCategoryChange: PropTypes.func.isRequired,
  categories: PropTypes.array.isRequired,
};

export default CategorySidebar;
