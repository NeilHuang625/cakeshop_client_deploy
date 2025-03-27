import PropTypes from "prop-types";

const ImageModal = ({ imageSrc, onClose }) => {
  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="relative rounded-lg bg-white p-4 shadow-lg">
        {/* 关闭按钮 */}
        <button
          className="absolute top-2 right-2 rounded bg-gray-700 px-2 py-1 text-white"
          onClick={onClose}
        >
          ✕
        </button>

        {/* 大图展示 */}
        <img
          src={imageSrc}
          alt="Preview"
          className="max-h-[80vh] max-w-full object-contain"
        />
      </div>
    </div>
  );
};

ImageModal.propTypes = {
  imageSrc: PropTypes.string,
  onClose: PropTypes.func,
};

export default ImageModal;
