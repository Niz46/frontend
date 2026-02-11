// src/components/CoverImageSelector.jsx
import { useRef, useState, useEffect } from "react";
import { LuTrash, LuFileImage } from "react-icons/lu";
import MultiPreviewGrid from "../MultiPreviewGrid";

const CoverImageSelector = ({
  image, // File | File[] | null
  setImage, // setter: File | File[] | null
  preview, // string | string[] | null
  setPreview, // setter: string | string[] | null
  multiple = false, // allow multiple or not
  maxCount = 10, // cap for grid
}) => {
  const inputRef = useRef(null);

  // Local preview state if parent didn't supply
  const [localPreviews, setLocalPreviews] = useState([]);

  // Whenever `preview` prop changes, sync our localPreviews
  useEffect(() => {
    if (Array.isArray(preview)) setLocalPreviews(preview);
    else if (preview) setLocalPreviews([preview]);
    else setLocalPreviews([]);
  }, [preview]);

  const handleFiles = (filesList) => {
    const files = Array.from(filesList).slice(0, maxCount);

    // update parent
    setImage(multiple ? files : files[0]);
    // generate preview URLs
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreview ? setPreview(multiple ? urls : urls[0]) : setLocalPreviews(urls);
  };

  const onChange = (e) => {
    if (!e.target.files) return;
    handleFiles(e.target.files);
  };

  const onRemove = () => {
    setImage(null);
    setPreview && setPreview(null);
    setLocalPreviews([]);
  };

  return (
    <div className="mb-6">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={onChange}
        className="hidden"
        multiple={multiple}
      />

      {!image && !localPreviews.length ? (
        <div
          className="w-full h-56 flex flex-col items-center justify-center gap-2 bg-gray-50 rounded-md border border-dashed border-gray-300 cursor-pointer"
          onClick={() => inputRef.current.click()}
        >
          <div className="w-14 h-14 flex items-center justify-center bg-sky-50 rounded-full">
            <LuFileImage className="text-xl text-sky-600" />
          </div>
          <p className="text-sm text-gray-700">
            Click to upload{" "}
            {multiple ? `up to ${maxCount} images` : "cover image"}
          </p>
        </div>
      ) : (
        <div className="relative w-full">
          {multiple && localPreviews.length > 1 ? (
            <MultiPreviewGrid urls={localPreviews} size="100%" />
          ) : (
            <div className="relative w-full h-56">
              <img
                src={localPreviews[0]}
                crossOrigin="anonymous"
                alt="Cover"
                className="w-full h-full object-cover rounded-md"
              />
            </div>
          )}
          <button
            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-md"
            onClick={onRemove}
            type="button"
          >
            <LuTrash />
          </button>
        </div>
      )}
    </div>
  );
};

export default CoverImageSelector;
