// src/pages/Blog/BlogPostGallery.jsx
import { useEffect, useState, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import Dropzone from "react-dropzone";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { toast } from "react-hot-toast";

import { fetchPosts } from "../../store/slices/blogSlice";
import uploadImagesPublic from "../../utils/uploadImage";
import BlogLayout from "../../components/layouts/BlogLayout/BlogLayout";
import Loading from "../../components/Loader/Loading";

const LOCAL_STORAGE_KEY = "myUploads";
const PRIMARY_TAGS = ["Journals", "Events", "Awardees"];

const normalizeTag = (t) => (typeof t === "string" ? t : t?.name || "").trim();

const isUserAuthorized = (user) => {
  if (!user) return false;
  if (user.isAdmin) return true;

  // roles: array of strings
  if (Array.isArray(user.roles)) {
    if (
      user.roles.some((r) =>
        ["admin", "uploader", "editor"].includes(String(r).toLowerCase()),
      )
    )
      return true;
  }

  // permissions: array of strings
  if (Array.isArray(user.permissions)) {
    if (
      user.permissions.includes("upload:image") ||
      user.permissions.includes("upload:images")
    )
      return true;
  }

  // email domain (example) - change domain to your real domain if you have one
  if (typeof user.email === "string" && /@uaacaii/i.test(user.email))
    return true;

  // historic fallback (kept for backwards compatibility)
  if (typeof user.name === "string" && /uaacaii$/i.test(user.name)) return true;

  return false;
};

const GallerySection = ({ title, photos = [], onImageClick }) => {
  return (
    <section aria-labelledby={`gallery-${title}`}>
      <h3 id={`gallery-${title}`} className="text-xl font-semibold mb-4">
        {title} ({photos.length})
      </h3>

      {photos.length === 0 ? (
        <p className="text-sm text-gray-500 mb-6">No images in this section.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {photos.map((photo, idx) => (
            <div
              key={`${photo.src}-${idx}`}
              className="relative group cursor-pointer overflow-hidden rounded-lg"
              onClick={() => onImageClick(idx)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onImageClick(idx);
              }}
              aria-label={`Open ${photo.title} by ${photo.author}`}
            >
              <img
                src={photo.src}
                alt={photo.title || "Gallery image"}
                crossOrigin="anonymous"
                className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black via-transparent opacity-0 group-hover:opacity-70 transition-opacity" />
              <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <h4 className="text-md font-semibold">{photo.title}</h4>
                <p className="text-sm">{photo.author}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

const BlogPostGallery = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.blog.posts);
  const status = useSelector((state) => state.blog.status);
  const user = useSelector((state) => state.auth.user);

  // Photo buckets keyed by section name
  const [sections, setSections] = useState({
    Journals: [],
    Events: [],
    Awardees: [],
    Other: [],
    Saved: [],
  });

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Journals");
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const [uploading, setUploading] = useState(false);

  const authorized = useMemo(() => isUserAuthorized(user), [user]);

  // Fetch posts on mount if idle
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchPosts({ status: "published", page: 1 }));
    }
  }, [dispatch, status]);

  // Build sectioned photo lists whenever posts or saved uploads change
  useEffect(() => {
    if (status !== "succeeded") return;

    // 1) From posts -> map into a flat array of { src, title, author, tags[] }
    const postImages = posts.flatMap((post) => {
      const tags = Array.isArray(post.tags)
        ? post.tags.map(normalizeTag).filter(Boolean)
        : post.tag
          ? [normalizeTag(post.tag)]
          : [];

      const authorName = post.author?.name || "Unknown";

      const images = (post.coverImageUrl || []).map((url) => ({
        src: url,
        title: post.title || "Untitled",
        author: authorName,
        tags,
        postId: post.id,
      }));

      return images;
    });

    // 2) Read saved uploads from localStorage (dedupe)
    const savedUrls = (() => {
      try {
        const raw = localStorage.getItem(LOCAL_STORAGE_KEY) || "[]";
        const arr = JSON.parse(raw);
        if (!Array.isArray(arr)) return [];
        // filter non-strings
        return arr.filter((u) => typeof u === "string");
      } catch {
        return [];
      }
    })();

    const savedPhotos = savedUrls.map((url) => ({
      src: url,
      title: "Saved",
      author: "Uaacaii",
      tags: [],
    }));

    // 3) Partition into sections
    const buckets = {
      Journals: [],
      Events: [],
      Awardees: [],
      Other: [],
      Saved: savedPhotos,
    };

    for (const img of postImages) {
      const matchedTag = (img.tags || []).find((t) =>
        PRIMARY_TAGS.some((p) => p.toLowerCase() === t.toLowerCase()),
      );

      if (matchedTag) {
        const proper = PRIMARY_TAGS.find(
          (p) => p.toLowerCase() === matchedTag.toLowerCase(),
        );
        buckets[proper].push(img);
      } else {
        buckets.Other.push(img);
      }
    }

    setSections(buckets);
  }, [posts, status]);

  // Upload handler
  const onDrop = useCallback(
    async (files) => {
      if (!authorized) {
        toast.error("You are not authorized to upload images.");
        return;
      }
      setUploading(true);
      try {
        const results = await uploadImagesPublic(files);
        if (!Array.isArray(results))
          throw new Error("Unexpected upload response");

        // Deduplicate saved URLs in localStorage
        const prevSaved = (() => {
          try {
            const raw = localStorage.getItem(LOCAL_STORAGE_KEY) || "[]";
            const arr = JSON.parse(raw);
            return Array.isArray(arr) ? arr : [];
          } catch {
            return [];
          }
        })();
        const setSaved = new Set(prevSaved);

        results.forEach(({ url }) => {
          if (!url) return;
          setSaved.add(url);
        });

        const newSavedArr = Array.from(setSaved);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newSavedArr));

        const newPhotos = results
          .filter((r) => r.url)
          .map((r) => ({
            src: r.url,
            title: "New Image",
            author: user?.name || "You",
            tags: [],
          }));

        setSections((prev) => ({
          ...prev,
          Saved: [...newPhotos, ...prev.Saved],
        }));

        toast.success("Upload successful");
      } catch (err) {
        console.error(err);
        const msg = (err && err.message) || "Upload failed";
        toast.error(msg);
      } finally {
        setUploading(false);
      }
    },
    [authorized, user],
  );

  // Open section lightbox
  const openSectionSlideshow = (sectionName, startIndex = 0) => {
    setActiveSection(sectionName);
    setLightboxIndex(startIndex);
    setLightboxOpen(true);
  };

  // Build slides for currently active section for Lightbox
  const activeSlides = useMemo(() => {
    const arr = sections[activeSection] || [];
    return arr.map((p) => ({ src: p.src }));
  }, [sections, activeSection]);

  return (
    <BlogLayout activeMenu="Gallery">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => openSectionSlideshow("Journals", 0)}
              className="px-4 py-2 bg-white border rounded hover:bg-gray-100 text-sm"
              aria-label="Start Journals slideshow"
            >
              Start Journals Slideshow
            </button>
            <button
              onClick={() => openSectionSlideshow("Events", 0)}
              className="px-4 py-2 bg-white border rounded hover:bg-gray-100 text-sm"
              aria-label="Start Events slideshow"
            >
              Start Events Slideshow
            </button>
          </div>

          <Dropzone
            onDrop={onDrop}
            multiple
            accept={{ "image/*": [] }}
            disabled={uploading || !authorized}
          >
            {({ getRootProps, getInputProps }) => (
              <button
                {...getRootProps()}
                className={`px-4 py-2 rounded text-sm focus:outline-none focus:ring ${
                  uploading || !authorized
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-600 text-white"
                }`}
                aria-disabled={uploading || !authorized}
                aria-label="Upload images"
              >
                <input {...getInputProps()} />
                {uploading
                  ? "Uploading…"
                  : authorized
                    ? "Upload images"
                    : "Not authorized"}
              </button>
            )}
          </Dropzone>
        </div>

        {/* Loading or sections */}
        {status === "loading" ? (
          <Loading />
        ) : (
          <div>
            {/* Render each primary section in order */}
            {PRIMARY_TAGS.map((tag) => (
              <GallerySection
                key={tag}
                title={tag}
                photos={sections[tag] || []}
                onImageClick={(idx) => openSectionSlideshow(tag, idx)}
              />
            ))}

            {/* Other */}
            <GallerySection
              title="Other"
              photos={sections.Other || []}
              onImageClick={(idx) => openSectionSlideshow("Other", idx)}
            />

            {/* Saved / Uploaded by user */}
            <GallerySection
              title="Saved"
              photos={sections.Saved || []}
              onImageClick={(idx) => openSectionSlideshow("Saved", idx)}
            />
          </div>
        )}

        {/* Lightbox */}
        {lightboxOpen && activeSlides.length > 0 && (
          <Lightbox
            open={lightboxOpen}
            close={() => setLightboxOpen(false)}
            index={lightboxIndex}
            slides={activeSlides}
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
