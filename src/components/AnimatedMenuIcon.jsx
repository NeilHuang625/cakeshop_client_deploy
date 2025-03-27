import { motion, AnimatePresence } from "framer-motion";
import { MdClose, MdMenu } from "react-icons/md";
import PropTypes from "prop-types";

const AnimatedMenuIcon = ({ open, onClick }) => {
  return (
    <AnimatePresence mode="wait">
      {open ? (
        <motion.div
          key="close"
          initial={{ opacity: 0, rotate: -90 }}
          animate={{ opacity: 1, rotate: 0 }}
          exit={{ opacity: 0, rotate: 90 }}
          transition={{ duration: 0.1 }}
          onClick={onClick}
        >
          <MdClose className="text-4xl" />
        </motion.div>
      ) : (
        <motion.div
          key="menu"
          initial={{ opacity: 0, rotate: -90 }}
          animate={{ opacity: 1, rotate: 0 }}
          exit={{ opacity: 0, rotate: 90 }}
          transition={{ duration: 0.1 }}
          onClick={onClick}
        >
          <MdMenu className="text-4xl" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

AnimatedMenuIcon.propTypes = {
  open: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default AnimatedMenuIcon;
