import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Dropzone from "react-dropzone";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { toast } from "react-hot-toast";

import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import uploadImagesPublic from "../../utils/uploadImage";
import BlogLayout from "../../components/layouts/BlogLayout/BlogLayout";
import Loading from "../../components/Loader/Loading";

const TABS = ["Journals", "Events", "Awardees", "Other"]; // Removed 'My Uploads' as Cloudinary is now the source of truth

const isUserAuthorized = (user) => {
  if (!user) return false;
  if (user.isAdmin || user.is_admin || user.admin || user.isAdministrator)
    return true;
  if (
    typeof user.role === "string" &&
    ["admin", "uploader", "editor"].includes(user.role.toLowerCase())
  )
    return true;
  if (typeof user.email === "string" && /@uaacaii/i.test(user.email))
    return true;
  if (typeof user.name === "string" && /uaacaii$/i.test(user.name)) return true;
  return false;
};

// --- UI COMPONENTS ---
const GalleryCard = memo(function GalleryCard({ photo, index, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      className="group relative w-full aspect-4/3 overflow-hidden rounded-2xl bg-gray-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
    >
      <img
        src={photo.src}
        alt={photo.title || "Gallery image"}
        crossOrigin="anonymous"
        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 transform opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 text-left">
        <h4 className="line-clamp-1 text-base font-bold text-white drop-shadow-md">
          {photo.title}
        </h4>
        <p className="line-clamp-1 text-sm font-medium text-white/80">
          {photo.author}
        </p>
      </div>
    </button>
  );
});

const BlogPostGallery = () => {
  const user = useSelector((state) => state.auth.user);
  const authorized = useMemo(() => isUserAuthorized(user), [user]);

  const [activeTab, setActiveTab] = useState("Journals");
  const [activePhotos, setActivePhotos] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [uploading, setUploading] = useState(false);

  // Fetch images directly from Cloudinary via backend when tab changes
  const fetchGalleryImages = useCallback(async (tag) => {
    setFetching(true);
    try {
      const response = await axiosInstance.get(
        API_PATHS.GALLERY.GET_BY_TAG(tag),
      );
      setActivePhotos(response.data);
    } catch (error) {
      console.error("Failed to fetch gallery:", error);
      toast.error(`Failed to load ${tag} images`);
      setActivePhotos([]);
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchGalleryImages(activeTab);
  }, [activeTab, fetchGalleryImages]);

  const onDrop = useCallback(
    async (files) => {
      if (!authorized)
        return toast.error("You are not authorized to upload images.");
      if (!files?.length) return;

      setUploading(true);
      try {
        await uploadImagesPublic(files, { category: activeTab });
        toast.success(`Uploaded to ${activeTab} successfully!`);

        // Refresh current tab to show newly uploaded images
        fetchGalleryImages(activeTab);
      } catch (err) {
        toast.error(err?.message || "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [authorized, activeTab, fetchGalleryImages],
  );

  return (
    <BlogLayout activeMenu="Gallery">
      <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-blue-500 mb-2">
              Media Gallery
            </h1>
            <p className="text-base text-gray-500 max-w-2xl">
              Browse event highlights, journal covers, and awardee showcases.
            </p>
          </div>

          {/* Upload Dropzone */}
          {authorized && (
            <Dropzone
              onDrop={onDrop}
              multiple
              accept={{ "image/*": [] }}
              disabled={uploading}
            >
              {({ getRootProps, getInputProps }) => (
                <div {...getRootProps()} className="shrink-0">
                  <input {...getInputProps()} />
                  <button
                    type="button"
                    className={`flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold shadow-sm transition-all ${
                      uploading
                        ? "cursor-wait bg-gray-100 text-gray-400"
                        : "bg-blue-500 text-white hover:bg-gray-800 hover:shadow-md hover:-translate-y-0.5"
                    }`}
                  >
                    {uploading ? (
                      "Uploading..."
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                          ></path>
                        </svg>
                        Upload to {activeTab}
                      </>
                    )}
                  </button>
                </div>
              )}
            </Dropzone>
          )}
        </div>

        {/* Slick Tab Navigation */}
        <div className="mb-8 border-b border-gray-200">
          <nav className="-mb-px flex space-x-6 overflow-x-auto scrollbar-hide">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Gallery Grid */}
        {fetching ? (
          <div className="flex justify-center py-20">
            <Loading />
          </div>
        ) : activePhotos.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-gray-50 py-32 text-center">
            <div className="mb-4 rounded-full bg-gray-200 p-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                ></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              No images found
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              There are no images in the {activeTab} category yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {activePhotos.map((photo, idx) => (
              <GalleryCard
                key={`${photo.src}-${idx}`}
                photo={photo}
                index={idx}
                onOpen={(i) => {
                  setLightboxIndex(i);
                  setLightboxOpen(true);
                }}
              />
            ))}
          </div>
        )}

        {/* Lightbox Overlay */}
        {lightboxOpen && activePhotos.length > 0 && (
          <Lightbox
            open={lightboxOpen}
            close={() => setLightboxOpen(false)}
            index={lightboxIndex}
            slides={activePhotos}
            animation={{ fade: 250, swipe: 300 }}
          />
        )}
      </div>
    </BlogLayout>
  );
};

export default BlogPostGallery;
