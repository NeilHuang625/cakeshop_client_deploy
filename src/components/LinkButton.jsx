import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const LinkButton = ({ children, to, onClick, useBy }) => {
  if (useBy === "menu") {
    return (
      <Link
        className="text-primary w-full rounded-sm px-4 py-2 text-lg font-semibold tracking-wide transition-all duration-300 hover:bg-amber-400"
        to={to}
        onClick={onClick}
      >
        {children}
      </Link>
    );
  }
  if (useBy === "header") {
    return (
      <Link
        className="text-primary rounded-sm px-4 py-2 text-lg font-semibold tracking-wide transition-all duration-300 hover:bg-amber-400"
        to={to}
        onClick={onClick}
      >
        {children}
      </Link>
    );
  }
};

LinkButton.propTypes = {
  children: PropTypes.node.isRequired,
  to: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  useBy: PropTypes.string,
};

export default LinkButton;
