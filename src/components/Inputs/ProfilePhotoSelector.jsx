// src/components/Inputs/ProfilePhotoSelector.jsx
import { useRef, useState, useEffect } from "react";
import { LuUser, LuUpload, LuTrash } from "react-icons/lu";

const ProfilePhotoSelector = ({ image, setImage }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (!image) {
      setPreviewUrl(null);
      return;
    }
    if (typeof image === "string") {
      setPreviewUrl(image);
      return;
    }
    const blobUrl = URL.createObjectURL(image);
    setPreviewUrl(blobUrl);
    return () => URL.revokeObjectURL(blobUrl);
  }, [image]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  return (
    <div className="flex justify-center mb-6">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageChange}
      />

      { !image ? (
        <div className="w-20 h-20 flex items-center justify-center bg-sky-50 rounded-full relative shadow">
          <LuUser className="text-4xl text-sky-500" />
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center bg-linear-to-r from-cyan-400 to-sky-50 text-white rounded-full absolute -bottom-1 -right-1 shadow"
            onClick={() => inputRef.current.click()}
          >
            <LuUpload />
          </button>
        </div>
      ) : (
        <div className="relative">
          <img
            src={previewUrl}
            alt="profile avatar"
            className="w-20 h-20 rounded-full object-cover"
          />
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1"
            onClick={handleRemoveImage}
          >
            <LuTrash />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoSelector;
