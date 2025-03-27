import PropTypes from "prop-types";

const Button = ({ children, onClick, ref }) => {
  return (
    <button
      onClick={onClick}
      ref={ref}
      className="rounded-full p-2 text-2xl duration-200 hover:cursor-pointer hover:bg-amber-500 hover:text-amber-50"
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  ref: PropTypes.object,
};

export default Button;
