import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import PropTypes from "prop-types";
import { AiTwotoneCloseCircle } from "react-icons/ai";
import { RiDragMove2Fill } from "react-icons/ri";

const SortableImage = ({ id, src, onRemove, onClick }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative h-24 w-24 rounded-md border border-gray-300 shadow-lg md:h-32 md:w-32"
    >
      <img
        src={src}
        alt="Cake"
        className="h-full w-full cursor-pointer rounded-md object-cover transition-all duration-300 hover:scale-105"
        onClick={onClick}
      />

      <div
        {...attributes}
        {...listeners}
        className="absolute top-0 left-0 cursor-grab bg-gray-300 hover:opacity-80 active:cursor-grabbing"
      >
        <RiDragMove2Fill className="h-5 w-5" />
      </div>

      <button
        type="button"
        className="absolute -top-1 -right-1 rounded text-xs text-white hover:cursor-pointer hover:opacity-80"
        onClick={(e) => {
          e.stopPropagation();
          console.log("Remove clicked:", id);
          onRemove(id, src);
        }}
      >
        <AiTwotoneCloseCircle className="h-6 w-6" />
      </button>
    </div>
  );
};

SortableImage.propTypes = {
  id: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  onRemove: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default SortableImage;
