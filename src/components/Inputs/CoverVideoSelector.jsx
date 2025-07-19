// src/components/CoverVideoSelector.jsx
import { useRef, useState, useEffect } from "react";
import { LuFileVideo, LuTrash } from "react-icons/lu";
import MultiPreviewGrid from "../MultiPreviewGrid";

const CoverVideoSelector = ({
  video, // File | File[] | null
  setVideo, // setter
  preview, // string | string[] | null
  setPreview, // setter
  multiple = false,
  maxCount = 5,
}) => {
  const inputRef = useRef(null);
  const [localPreviews, setLocalPreviews] = useState([]);

  useEffect(() => {
    if (Array.isArray(preview)) setLocalPreviews(preview);
    else if (preview) setLocalPreviews([preview]);
    else setLocalPreviews([]);
  }, [preview]);

  const handleFiles = (filesList) => {
    const files = Array.from(filesList).slice(0, maxCount);
    setVideo(multiple ? files : files[0]);
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreview ? setPreview(multiple ? urls : urls[0]) : setLocalPreviews(urls);
  };

  const onChange = (e) => {
    if (!e.target.files) return;
    handleFiles(e.target.files);
  };

  const onRemove = () => {
    setVideo(null);
    setPreview && setPreview(null);
    setLocalPreviews([]);
  };

  return (
    <div className="mb-6">
      <input
        type="file"
        accept="video/*"
        ref={inputRef}
        onChange={onChange}
        className="hidden"
        multiple={multiple}
      />

      {!video && !localPreviews.length ? (
        <div
          className="w-full h-56 flex flex-col items-center justify-center gap-2 bg-gray-50 rounded-md border border-dashed border-gray-300 cursor-pointer"
          onClick={() => inputRef.current.click()}
        >
          <div className="w-14 h-14 flex items-center justify-center bg-sky-50 rounded-full">
            <LuFileVideo className="text-xl text-sky-600" />
          </div>
          <p className="text-sm text-gray-700">
            Click to upload{" "}
            {multiple ? `up to ${maxCount} videos` : "cover video"}
          </p>
        </div>
      ) : (
        <div className="relative w-full">
          {multiple && localPreviews.length > 1 ? (
            <MultiPreviewGrid urls={localPreviews} isVideo />
          ) : (
            <video
              src={localPreviews[0]}
              className="w-full h-56 object-cover rounded-md"
              muted
              controls
              crossOrigin="anonymous"
              playsInline
            />
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

export default CoverVideoSelector;
