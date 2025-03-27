import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";

const FlyToCartAnimation = ({ flyingItem }) => {
  return (
    <AnimatePresence>
      {flyingItem && (
        <motion.img
          src={flyingItem.image}
          className="fixed rounded-lg object-cover shadow-lg"
          style={{
            left: flyingItem.x,
            top: flyingItem.y,
            width: flyingItem.width,
            height: flyingItem.height,
          }}
          initial={{ opacity: 1, scale: 1 }}
          animate={{
            left: flyingItem.targetX - flyingItem.x,
            top: flyingItem.targetY - flyingItem.y,
            scale: 0.1,
            opacity: 0,
          }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          exit={{ opacity: 0 }}
        />
      )}
    </AnimatePresence>
  );
};

FlyToCartAnimation.propTypes = {
  flyingItem: PropTypes.object,
};

export default FlyToCartAnimation;
