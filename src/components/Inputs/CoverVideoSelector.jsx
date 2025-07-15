import { useRef, useState } from "react";
import { LuFileVideo, LuTrash } from "react-icons/lu";

const CoverVideoSelector = ({ video, setVideo, preview, setPreview }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleVideoChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setVideo(file);
    const url = URL.createObjectURL(file);

    if (setPreview) setPreview(url);
    setPreviewUrl(url);
  };

  const handleRemoveVideo = () => {
    setVideo(null);
    setPreviewUrl(null);
    if (setPreview) setPreview(null);
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };

  return (
    <div className="mb-6">
      <input
        type="file"
        accept="video/*"
        ref={inputRef}
        onChange={handleVideoChange}
        className="hidden"
      />

      {!video && !preview ? (
        <div
          className="w-full h-56 flex flex-col items-center justify-center gap-2 bg-gray-50/50 rounded-md border border-dashed border-gray-300 cursor-pointer relative"
          onClick={onChooseFile}
        >
          <div className="w-14 h-14 flex items-center justify-center bg-sky-50 rounded-full">
            <LuFileVideo className="text-xl text-sky-600" />
          </div>
          <p className="text-sm text-gray-700">Click to upload cover video</p>
        </div>
      ) : (
        <div className="relative w-full h-56">
          <video
            src={preview || previewUrl}
            className="w-full h-full object-cover rounded-md"
            controls
          />
          <button
            type="button"
            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-md cursor-pointer"
            onClick={handleRemoveVideo}
          >
            <LuTrash />
          </button>
        </div>
      )}
    </div>
  );
};

export default CoverVideoSelector;
