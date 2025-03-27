import MUISelect from "./MUISelect";
import PropTypes from "prop-types";
const SortingSelector = ({ handleSortByChange }) => {
  return (
    <form className="flex items-center justify-center gap-2">
      <label htmlFor="categories" className="text-sm font-medium text-gray-900">
        Sort By
      </label>
      <MUISelect
        onChange={handleSortByChange}
        options={[
          { name: "Default", value: "" },
          { name: "Price: High to Low", value: "price-desc" },
          { name: "Price: Low to High", value: "price-asc" },
        ]}
        type="stringOption"
        width="180px"
      />
    </form>
  );
};

SortingSelector.propTypes = {
  handleSortByChange: PropTypes.func.isRequired,
};

export default SortingSelector;
