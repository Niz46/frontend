// src/pages/Blog/BlogPostGallery.jsx
import { useEffect, useState, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import Dropzone from "react-dropzone";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { toast } from "react-hot-toast";

import { fetchPosts, fetchPostsByTag } from "../../store/slices/blogSlice";
import uploadImagesPublic from "../../utils/uploadImage";
import BlogLayout from "../../components/layouts/BlogLayout/BlogLayout";
import Loading from "../../components/Loader/Loading";

const LOCAL_STORAGE_KEY = "myUploads";
const PRIMARY_TAGS = ["Journals", "Events", "Awardees"];

const normalizeTag = (t) => (typeof t === "string" ? t : t?.name || "").trim();

const isUserAuthorized = (user) => {
  if (!user) return false;

  // 1) explicit boolean flags (many backends use different names)
  if (user.isAdmin || user.is_admin || user.admin || user.isAdministrator)
    return true;
  // 2) role as a string property
  if (
    typeof user.role === "string" &&
    ["admin", "uploader", "editor"].includes(user.role.toLowerCase())
  )
    return true;

  // 3) roles: array which may contain strings or objects ({name: 'admin'})
  if (Array.isArray(user.roles)) {
    const found = user.roles.some((r) => {
      if (!r) return false;
      if (typeof r === "string")
        return ["admin", "uploader", "editor"].includes(r.toLowerCase());
      if (typeof r === "object" && r.name)
        return ["admin", "uploader", "editor"].includes(
          String(r.name).toLowerCase(),
        );
      // fallback stringify
      return ["admin", "uploader", "editor"].includes(String(r).toLowerCase());
    });
    if (found) return true;
  }

  // 4) permissions: array of strings or objects { name: 'upload:image' }
  if (Array.isArray(user.permissions)) {
    const hasUploadPerm = user.permissions.some((p) => {
      if (!p) return false;
      if (typeof p === "string")
        return ["upload:image", "upload:images"].includes(p);
      if (typeof p === "object" && p.name)
        return ["upload:image", "upload:images"].includes(String(p.name));
      return false;
    });
    if (hasUploadPerm) return true;
  }

  // 5) email domain (example) - keep as fallback
  if (typeof user.email === "string" && /@uaacaii/i.test(user.email))
    return true;

  // 6) historic fallback - username suffix
  if (typeof user.name === "string" && /uaacaii$/i.test(user.name)) return true;

  return false;
};

const GallerySection = ({
  title,
  photos = [],
  onImageClick,
  loadMore,
  loadingMore,
  moreAvailable,
}) => {
  return (
    <section aria-labelledby={`gallery-${title}`} className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 id={`gallery-${title}`} className="text-xl font-semibold">
          {title} ({photos.length})
        </h3>
        {loadMore && (
          <div>
            <button
              onClick={loadMore}
              disabled={loadingMore || !moreAvailable}
              className={`px-3 py-1 rounded text-sm border ${
                loadingMore
                  ? "bg-gray-200 cursor-wait"
                  : moreAvailable
                    ? "bg-white hover:bg-gray-50"
                    : "bg-gray-100 cursor-not-allowed"
              }`}
            >
              {loadingMore
                ? "Loading…"
                : moreAvailable
                  ? "Load more"
                  : "No more"}
            </button>
          </div>
        )}
      </div>

      {photos.length === 0 ? (
        <p className="text-sm text-gray-500">No images in this section.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
  const tagPages = useSelector((state) => state.blog.tagPages || {});
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

  // Tag-loading indicator local state (per tag)
  const [loadingTag, setLoadingTag] = useState({}); // e.g. { Journals: false }

  // Fetch global posts on mount if idle (keeps 'Other' section populated)
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchPosts({ status: "published", page: 1 }));
    }
  }, [dispatch, status]);

  /**
   * Fetch one page for a primary tag.
   * - If tag cache missing, fetch page 1.
   * - If fetching more, increment page number.
   */
  const loadTagPage = useCallback(
    async (tag) => {
      try {
        const tagKey = String(tag);
        const current = tagPages[tagKey] || { page: 0, totalPages: 1 };

        // determine next page
        const nextPage = Math.min(
          (current.page || 0) + 1,
          Math.max(1, current.totalPages || 1),
        );

        // if we've already reached last page, bail
        if (current.page && current.page >= (current.totalPages || 1)) return;

        setLoadingTag((prev) => ({ ...prev, [tagKey]: true }));
        // dispatch thunk
        await dispatch(
          fetchPostsByTag({ tag: tagKey, status: "published", page: nextPage }),
        ).unwrap();
      } catch (err) {
        console.error("[loadTagPage]", err);
        toast.error((err && err.message) || "Failed to load more images");
      } finally {
        setLoadingTag((prev) => ({ ...prev, [tag]: false }));
      }
    },
    [dispatch, tagPages],
  );

  // Build sectioned photo lists whenever posts, tagPages or saved uploads change
  useEffect(() => {
    // 1) For primary tags, prefer tagPages cache if present, otherwise fall back to scanning global posts
    const buckets = {
      Journals: [],
      Events: [],
      Awardees: [],
      Other: [],
      Saved: [],
    };

    // helper to map post -> images
    const postToImages = (post) => {
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
    };

    // use tagPages for primary tags
    for (const tag of PRIMARY_TAGS) {
      const cache = tagPages[tag];
      if (cache && Array.isArray(cache.posts) && cache.posts.length > 0) {
        // map each post -> images
        const imgs = cache.posts.flatMap((p) => postToImages(p));
        buckets[tag] = imgs;
      } else {
        // fallback: scan global posts and pick matching posts
        const matched = posts.flatMap((post) => {
          const tags = Array.isArray(post.tags)
            ? post.tags.map(normalizeTag).filter(Boolean)
            : post.tag
              ? [normalizeTag(post.tag)]
              : [];
          const matchedTag = tags.find(
            (t) => t && t.toLowerCase() === tag.toLowerCase(),
          );
          if (matchedTag) return postToImages(post);
          return [];
        });
        buckets[tag] = matched;
      }
    }

    // Other: any images that didn't match a PRIMARY_TAG (from global posts)
    const allPostImages = posts.flatMap(postToImages);
    const primaryLower = PRIMARY_TAGS.map((p) => p.toLowerCase());
    buckets.Other = allPostImages.filter((img) => {
      const hasPrimary = (img.tags || []).some((t) =>
        primaryLower.includes(t.toLowerCase()),
      );
      return !hasPrimary;
    });

    // Saved from localStorage
    const savedUrls = (() => {
      try {
        const raw = localStorage.getItem(LOCAL_STORAGE_KEY) || "[]";
        const arr = JSON.parse(raw);
        if (!Array.isArray(arr)) return [];
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
    buckets.Saved = savedPhotos;

    setSections(buckets);
  }, [posts, tagPages]);

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
            {/* Render each primary section in order (uses tag cache + Load more) */}
            {PRIMARY_TAGS.map((tag) => {
              const photos = sections[tag] || [];
              const cache = tagPages[tag] || {};
              const moreAvailable = (cache.page || 0) < (cache.totalPages || 1);
              const loadingMore = !!loadingTag[tag];
              return (
                <GallerySection
                  key={tag}
                  title={tag}
                  photos={photos}
                  onImageClick={(idx) => openSectionSlideshow(tag, idx)}
                  loadMore={() => loadTagPage(tag)}
                  loadingMore={loadingMore}
                  moreAvailable={moreAvailable}
                />
              );
            })}

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
