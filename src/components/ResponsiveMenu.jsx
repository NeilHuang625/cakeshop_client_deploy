import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import LinkButton from "./LinkButton";

const ResponsiveMenu = ({ open, onClick }) => {
  return (
    <AnimatePresence mode="wait">
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: -22 }}
          exit={{ opacity: 0, y: -100 }}
          className="absolute top-20 right-4 z-20 mx-auto w-9/10"
        >
          <div className="text-md fount-semibold flex flex-col items-end justify-center rounded-2xl bg-amber-500 py-5 text-white uppercase">
            <LinkButton onClick={onClick} to="/" useBy="menu">
              Home
            </LinkButton>
            <LinkButton onClick={onClick} to="/cakes" useBy="menu">
              Products
            </LinkButton>
            <LinkButton onClick={onClick} to="/about" useBy="menu">
              About Us
            </LinkButton>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Set the prop types for this component
ResponsiveMenu.propTypes = {
  open: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default ResponsiveMenu;
