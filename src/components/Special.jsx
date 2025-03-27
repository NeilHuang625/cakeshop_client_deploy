import { useContext } from "react";
import CakeContext from "../contexts/CakeContext";
import SpecialCakeCard from "./SpecialCakeCard";

const Special = () => {
  const { cakes } = useContext(CakeContext);
  const promotedCakes = cakes.filter((cake) => cake.isPromoted);
  return (
    <div className="my-7 flex flex-col items-center justify-center">
      <div className="flex items-center justify-center gap-5">
        <div className="h-1 w-30 rounded-full bg-yellow-500"></div>
        <h1 className="text-center text-xl font-bold tracking-widest text-gray-700">
          Special Cakes
        </h1>
        <div className="h-1 w-30 rounded-full bg-yellow-500"></div>
      </div>

      <div className="mt-7 grid grid-cols-1 gap-7 px-4 sm:grid-cols-2">
        {promotedCakes.map((cake) => (
          <SpecialCakeCard key={cake.id} cake={cake} />
        ))}
      </div>
    </div>
  );
};
export default Special;
