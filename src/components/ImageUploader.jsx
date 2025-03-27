import { closestCenter, DndContext } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useCallback, useState } from "react";
import ImageModal from "./ImageModal";
import { useDropzone } from "react-dropzone";
import SortableImage from "./SortableImage";
import PropTypes from "prop-types";
import { AiOutlineFolderAdd } from "react-icons/ai";

const ImageUploader = ({ values, setFieldValue }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const newImages = acceptedFiles.map((file) => ({
        id: URL.createObjectURL(file),
        src: URL.createObjectURL(file),
        file,
      }));
      setFieldValue("CakeImages", [...values.CakeImages, ...newImages]);
    },
    [values.CakeImages, setFieldValue],
  );

  const onDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const newImageOrder = arrayMove(
        values.CakeImages,
        values.CakeImages.findIndex((img) => img.id === active.id),
        values.CakeImages.findIndex((img) => img.id === over.id),
      );

      setFieldValue("CakeImages", newImageOrder);

      // Update the order of the existing images
      setFieldValue(
        "ExistingCakeImages",
        newImageOrder.filter((img) => img.file === null).map((img) => img.src),
      );
    }
  };

  const removeImage = (id, src) => {
    setFieldValue(
      "CakeImages",
      values.CakeImages.filter((img) => img.id !== id),
    );
    setFieldValue(
      "ExistingCakeImages",
      values.ExistingCakeImages.filter((item) => item !== src),
    );
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/gif": [],
      "image/webp": [],
      "image/bmp": [],
      "image/svg+xml": [],
    },
    maxSize: 1024 * 1024 * 2,
  });

  return (
    <div>
      <div className="flex flex-col gap-2 md:flex-row md:items-end">
        {/* Drap and upload area */}
        <div
          {...getRootProps({
            className:
              "w-36 h-20 md:w-64 md:h-36 md:p-4 p-2 text-center border border-dashed bg-gray-100 text-gray-500  border-gray-300 rounded-md cursor-pointer",
          })}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2">
            <AiOutlineFolderAdd className="h-8 w-8 md:h-10 md:w-10" />
            <p className="block md:hidden">Click & Upload</p>
            <p className="hidden md:block">
              {isDragActive
                ? "Drop here..."
                : "Drag & drop images here, or click to select images"}
            </p>
          </div>
        </div>

        {/* preview and sorting */}
        <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext
            items={values.CakeImages.map((img) => img.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-wrap space-x-4">
              {values.CakeImages.map((img) => (
                <SortableImage
                  key={img.id}
                  id={img.id}
                  src={img.src}
                  onRemove={removeImage}
                  onClick={() => setSelectedImage(img.src)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* 大图预览模态框 */}
      {selectedImage && (
        <ImageModal
          imageSrc={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
};

ImageUploader.propTypes = {
  values: PropTypes.shape({
    CakeImages: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        src: PropTypes.string,
        file: PropTypes.object,
      }),
    ),
    ExistingCakeImages: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  setFieldValue: PropTypes.func,
};

export default ImageUploader;
