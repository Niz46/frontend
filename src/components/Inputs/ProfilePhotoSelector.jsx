import { useRef, useState } from "react";
import { LuUser, LuUpload, LuTrash } from "react-icons/lu";
import { resolveMediaUrl } from "../../utils/helper";

const ProfilePhotoSelector = ({ image, setImage, preview, setPreview }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);

      const preview = URL.createObjectURL(file);
      if (setPreview) {
        setPreview(preview);
      }
      setPreviewUrl(preview);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);

    if (setPreview) {
      setPreview(null);
    }
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };
  return (
    <div className="flex justify-center mb-6">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={inputRef}
        onChange={handleImageChange}
      />

      {!image ? (
        <div className="w-20 h-20 flex items-center justify-center bg-sky-50 rounded-full relative cursor-pointer shadow">
          <LuUser className="text-4xl text-sky-500" />

          <button
            className="w-8 h-8 flex items-center justify-center bg-linear-to-r from-cyan-400 to-sky-50 text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer shadow"
            onClick={onChooseFile}
            type="button"
          >
            <LuUpload />
          </button>
        </div>
      ) : (
        <div className="relative">
          <img
            src={resolveMediaUrl(preview || previewUrl)}
            alt="profile avatar"
            className="w-20 h-20 rounded-full object-cover"
          />
          <button
            className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer"
            type="button"
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
