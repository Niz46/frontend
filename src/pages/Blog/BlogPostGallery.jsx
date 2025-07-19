// src/pages/Blog/BlogPostGallery.jsx
import { useEffect, useState, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import Dropzone from "react-dropzone";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { toast } from "react-hot-toast";

import { fetchPosts } from "../../store/slices/blogSlice";
import uploadImages from "../../utils/uploadImage";
import BlogLayout from "../../components/layouts/BlogLayout/BlogLayout";
import Loading from "../../components/Loader/Loading";

const LOCAL_STORAGE_KEY = "myUploads";

const BlogPostGallery = () => {
  const dispatch = useDispatch();
  const posts = useSelector((s) => s.blog.posts);
  const status = useSelector((s) => s.blog.status);
  const user = useSelector((s) => s.auth.user);

  // ─── Local state ───────────────────────────────────────────────────────────
  const [photos, setPhotos] = useState([]); // { src, title, author }
  const [slideshowIndex, setSlideshowIndex] = useState(0);
  const [slideshowOpen, setSlideshowOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  // ─── Authorization: user.name must contain “uaacaii” ───────────────────────
  const isAuthorized = useMemo(() => {
    if (!user?.name) return false;
    return /uaacaii$/i.test(user.name);
  }, [user]);

  // ─── 1) Fetch posts on mount ───────────────────────────────────────────────
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchPosts({ status: "published", page: 1 }));
    }
  }, [dispatch, status]);

  // ─── 2) Build photo list whenever posts or storage change ────────────────
  useEffect(() => {
    if (status !== "succeeded") return;

    // a) Build from fetched posts
    const postPhotos = posts.map((p) => ({
      src: p.coverImageUrl,
      title: p.title,
      author: p.author?.name || "Unknown",
    }));

    // b) Read any saved uploads from localStorage
    const savedUrls = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_KEY) || "[]"
    );
    const savedPhotos = savedUrls.map((url) => ({
      src: url,
      title: "Saved",
      author: "You",
    }));

    // c) Merge and set
    setPhotos([...postPhotos, ...savedPhotos]);
  }, [posts, status]);

  // ─── 3) Handle drag‑and‑drop uploads ──────────────────────────────────────
  const onDrop = useCallback(
    async (files) => {
      if (!isAuthorized) {
        toast.error("You are not authorized to upload images.");
        return;
      }

      setUploading(true);
      try {
        await Promise.all(
          files.map(async (file) => {
            const { imageUrl } = await uploadImages(file);

            // a) Add to component state
            setPhotos((prev) => [
              ...prev,
              { src: imageUrl, title: "New Image", author: user.name },
            ]);

            // b) Persist to localStorage
            const previous = JSON.parse(
              localStorage.getItem(LOCAL_STORAGE_KEY) || "[]"
            );
            localStorage.setItem(
              LOCAL_STORAGE_KEY,
              JSON.stringify([...previous, imageUrl])
            );

            toast.success("Upload successful");
          })
        );
      } catch (err) {
        console.error(err);
        toast.error("Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [isAuthorized, user]
  );

  // ─── 4) Open slideshow ────────────────────────────────────────────────────
  const openSlideshow = (startIndex = 0) => {
    setSlideshowIndex(startIndex);
    setSlideshowOpen(true);
  };

  return (
    <BlogLayout activeMenu="Gallery">
      <div className="p-6 space-y-6">
        {/* Header with Slideshow & Upload */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => openSlideshow(0)}
            className="px-4 py-2 bg-white border rounded hover:bg-gray-100 text-sm"
          >
            Start Slideshow
          </button>

          <Dropzone
            onDrop={onDrop}
            multiple
            accept={{ "image/*": [] }}
            disabled={uploading || !isAuthorized}
          >
            {({ getRootProps, getInputProps }) => (
              <button
                {...getRootProps()}
                className={`
                  px-4 py-2 bg-blue-600 text-white rounded text-sm
                  focus:outline-none focus:ring ${
                    uploading || !isAuthorized
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }
                `}
              >
                <input {...getInputProps()} />
                {uploading
                  ? "Uploading…"
                  : isAuthorized
                  ? "Upload"
                  : "Not Authorized"}
              </button>
            )}
          </Dropzone>
        </div>

        {/* Gallery Grid */}
        {status === "loading" ? (
          <Loading />
        ) : photos.length === 0 ? (
          <p className="text-center text-gray-500">No images available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo, idx) => (
              <div
                key={idx}
                className="relative group cursor-pointer overflow-hidden rounded-lg"
                onClick={() => openSlideshow(idx)}
              >
                <img
                  src={photo.src}
                  alt={photo.title}
                  crossOrigin="anonymous"
                  className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-0 group-hover:opacity-80 transition-opacity" />
                <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <h2 className="text-lg font-semibold">{photo.title}</h2>
                  <p className="text-sm">{photo.author}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox Slideshow */}
        {slideshowOpen && (
          <Lightbox
            open={slideshowOpen}
            close={() => setSlideshowOpen(false)}
            index={slideshowIndex}
            slides={photos.map((p) => ({ src: p.src }))}
            animation={{ fade: 200, swipe: 300 }}
            render={{
              slide: ({ slide }) => (
                <img
                  src={slide.src}
                  alt=""
                  crossOrigin="anonymous"
                  className="w-full h-full object-contain"
                />
              ),
            }}
          />
        )}
      </div>
    </BlogLayout>
  );
};

export default BlogPostGallery;
