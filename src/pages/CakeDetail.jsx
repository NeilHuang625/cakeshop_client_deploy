import { useContext } from "react";
import CakeContext from "../contexts/CakeContext";
import { useParams } from "react-router-dom";
import ImageGallery from "../components/ImageGallery";
import CakeOptions from "../components/CakeOptions";
import LoadingSign from "../components/LoadingSign";

const CakeDetail = () => {
  const { id } = useParams();
  const { cakes } = useContext(CakeContext);
  const cake = cakes.find((cake) => cake.id === id);

  if (!cake) {
    return <LoadingSign />;
  }

  return (
    <div className="mx-auto my-12 px-6 py-4 sm:max-w-7xl sm:px-30 sm:py-6">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <ImageGallery images={cake.cakeImages} />
        <CakeOptions cake={cake} />
      </div>
    </div>
  );
};

export default CakeDetail;
