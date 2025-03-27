import { useContext, useState } from "react";
import PropTypes from "prop-types";
import CartIconContext from "../contexts/CartIconContext";

const ImageGallery = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const { cakeDetailPageImageRef } = useContext(CartIconContext);

  return (
    <div className="flex flex-col items-center">
      {/* Big pic */}
      <img
        ref={cakeDetailPageImageRef}
        src={selectedImage}
        alt="Cake"
        className="max-h-96 w-full rounded-lg object-cover shadow-lg"
      />

      {/* Small pic */}
      <div className="mt-4 flex gap-2">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt="Cake Thumbnail"
            className={`h-16 w-16 cursor-pointer rounded-md border-2 object-cover ${
              selectedImage === img ? "border-blue-500" : "border-transparent"
            }`}
            onClick={() => setSelectedImage(img)}
          />
        ))}
      </div>
    </div>
  );
};

ImageGallery.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ImageGallery;
