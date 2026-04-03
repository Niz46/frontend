// src/pages/Blog/BlogPostGallery.jsx
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dropzone from "react-dropzone";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { toast } from "react-hot-toast";

import { fetchPosts, fetchPostsByTag } from "../../store/slices/blogSlice";
import uploadImagesPublic from "../../utils/uploadImage";
import BlogLayout from "../../components/layouts/BlogLayout/BlogLayout";
import Loading from "../../components/Loader/Loading";

const LOCAL_STORAGE_KEY = "myUploads";

const SECTION_CONFIG = [
  { key: "Journals", label: "Journals" },
  { key: "Events", label: "Events" },
  { key: "Awardees", label: "Awardees" },
  { key: "Other", label: "Other" },
  { key: "Saved", label: "Saved" },
];

const PRIMARY_TAGS = SECTION_CONFIG.filter(
  (section) => !["Other", "Saved"].includes(section.key),
).map((section) => section.key);

const SECTION_ALIASES = {
  Journals: ["journal", "journals"],
  Events: ["event", "events"],
  Awardees: ["awardee", "awardees"],
};

const normalizeTag = (value) => {
  if (typeof value === "string") return value.trim().toLowerCase();
  if (typeof value === "object" && value) {
    return String(value.name || value.label || value.slug || "")
      .trim()
      .toLowerCase();
  }
  return "";
};

const readJSON = (key, fallback = []) => {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
};

const writeJSON = (key, value) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

const isUserAuthorized = (user) => {
  if (!user) return false;

  if (user.isAdmin || user.is_admin || user.admin || user.isAdministrator) {
    return true;
  }

  if (
    typeof user.role === "string" &&
    ["admin", "uploader", "editor"].includes(user.role.toLowerCase())
  ) {
    return true;
  }

  if (Array.isArray(user.roles)) {
    const roleMatch = user.roles.some((role) => {
      if (!role) return false;
      if (typeof role === "string") {
        return ["admin", "uploader", "editor"].includes(role.toLowerCase());
      }
      if (typeof role === "object" && role.name) {
        return ["admin", "uploader", "editor"].includes(
          String(role.name).toLowerCase(),
        );
      }
      return false;
    });

    if (roleMatch) return true;
  }

  if (Array.isArray(user.permissions)) {
    const hasUploadPermission = user.permissions.some((permission) => {
      if (!permission) return false;
      if (typeof permission === "string") {
        return ["upload:image", "upload:images"].includes(
          permission.toLowerCase(),
        );
      }
      if (typeof permission === "object" && permission.name) {
        return ["upload:image", "upload:images"].includes(
          String(permission.name).toLowerCase(),
        );
      }
      return false;
    });

    if (hasUploadPermission) return true;
  }

  if (typeof user.email === "string" && /@uaacaii/i.test(user.email))
    return true;
  if (typeof user.name === "string" && /uaacaii$/i.test(user.name)) return true;

  return false;
};

const pushUrl = (acc, value) => {
  if (!value) return;

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed) acc.push(trimmed);
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => pushUrl(acc, item));
    return;
  }

  if (typeof value === "object") {
    pushUrl(acc, value.url);
    pushUrl(acc, value.src);
    pushUrl(acc, value.secure_url);
    pushUrl(acc, value.imageUrl);
  }
};

const getPostImageUrls = (post) => {
  const urls = [];

  [
    post?.coverImageUrl,
    post?.coverImage,
    post?.imageUrl,
    post?.image,
    post?.images,
    post?.media,
    post?.gallery,
    post?.galleryImages,
    post?.imageUrls,
  ].forEach((candidate) => pushUrl(urls, candidate));

  return Array.from(new Set(urls));
};

const getPostTags = (post) => {
  const rawTags = Array.isArray(post?.tags)
    ? post.tags
    : post?.tag
      ? [post.tag]
      : [];

  return rawTags.map(normalizeTag).filter(Boolean);
};

const matchesSection = (tags, sectionKey) => {
  const section = String(sectionKey).toLowerCase();
  const aliases = SECTION_ALIASES[sectionKey] || [section];

  return tags.some((tag) => {
    if (!tag) return false;
    if (tag === section) return true;
    if (aliases.includes(tag)) return true;
    return aliases.some((alias) => tag.includes(alias));
  });
};

const postToImages = (post) => {
  const tags = getPostTags(post);
  const title = post?.title || "Untitled";
  const author = post?.author?.name || post?.authorName || "Unknown";
  const urls = getPostImageUrls(post);

  return urls.map((src) => ({
    src,
    title,
    author,
    tags,
    postId: post?.id,
  }));
};

const buildSectionBuckets = (posts = [], tagPages = {}, savedUrls = []) => {
  const buckets = {
    Journals: [],
    Events: [],
    Awardees: [],
    Other: [],
    Saved: [],
  };

  const allPostImages = posts.flatMap(postToImages);

  for (const section of PRIMARY_TAGS) {
    const cache = tagPages?.[section];

    if (cache?.posts?.length) {
      buckets[section] = cache.posts.flatMap(postToImages);
      continue;
    }

    buckets[section] = posts.flatMap((post) => {
      const tags = getPostTags(post);
      return matchesSection(tags, section) ? postToImages(post) : [];
    });
  }

  const primaryLower = PRIMARY_TAGS.map((t) => t.toLowerCase());

  buckets.Other = allPostImages.filter((image) => {
    const tags = image.tags || [];
    return !tags.some((tag) => {
      const normalized = String(tag).toLowerCase();
      return primaryLower.some((section) => {
        const aliases = SECTION_ALIASES[
          PRIMARY_TAGS.find((name) => name.toLowerCase() === section)
        ] || [section];
        return aliases.includes(normalized) || normalized.includes(section);
      });
    });
  });

  buckets.Saved = savedUrls.map((src) => ({
    src,
    title: "Saved image",
    author: "You",
    tags: [],
  }));

  return buckets;
};

const GalleryCard = memo(function GalleryCard({
  photo,
  index,
  onOpen,
  sectionTitle,
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      className="group relative overflow-hidden rounded-xl border bg-white text-left shadow-sm transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      aria-label={`Open ${photo.title} by ${photo.author} in ${sectionTitle}`}
    >
      <img
        src={photo.src}
        alt={photo.title || "Gallery image"}
        crossOrigin="anonymous"
        className="h-52 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        loading="lazy"
        decoding="async"
      />

      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 transition-opacity group-hover:opacity-100">
        <h4 className="line-clamp-1 text-sm font-semibold">{photo.title}</h4>
        <p className="line-clamp-1 text-xs text-white/80">{photo.author}</p>
      </div>
    </button>
  );
});

const GallerySection = memo(function GallerySection({
  title,
  photos = [],
  onImageClick,
  onLoadMore,
  loadingMore = false,
  moreAvailable = false,
}) {
  return (
    <section className="mb-10" aria-labelledby={`section-${title}`}>
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h3 id={`section-${title}`} className="text-lg font-semibold">
            {title} <span className="text-gray-500">({photos.length})</span>
          </h3>
          <p className="text-sm text-gray-500">
            {photos.length === 0
              ? "No images in this section."
              : "Browse, open, or start a slideshow from here."}
          </p>
        </div>

        {onLoadMore ? (
          <button
            type="button"
            onClick={onLoadMore}
            disabled={loadingMore || !moreAvailable}
            className={`rounded-lg border px-4 py-2 text-sm transition ${
              loadingMore
                ? "cursor-wait bg-gray-100 text-gray-500"
                : moreAvailable
                  ? "bg-white hover:bg-gray-50"
                  : "cursor-not-allowed bg-gray-100 text-gray-400"
            }`}
          >
            {loadingMore ? "Loading…" : moreAvailable ? "Load more" : "No more"}
          </button>
        ) : null}
      </div>

      {photos.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-gray-50 py-10 text-center text-sm text-gray-500">
          Empty section
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {photos.map((photo, idx) => (
            <GalleryCard
              key={`${photo.src}-${idx}`}
              photo={photo}
              index={idx}
              onOpen={onImageClick}
              sectionTitle={title}
            />
          ))}
        </div>
      )}
    </section>
  );
});

const BlogPostGallery = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.blog.posts);
  const status = useSelector((state) => state.blog.status);
  const tagPages = useSelector((state) => state.blog.tagPages || {});
  const user = useSelector((state) => state.auth.user);

  const authorized = useMemo(() => isUserAuthorized(user), [user]);

  const [savedUrls, setSavedUrls] = useState([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Journals");
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [loadingTag, setLoadingTag] = useState({});

  useEffect(() => {
    setSavedUrls(readJSON(LOCAL_STORAGE_KEY, []));
  }, []);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchPosts({ status: "published", page: 1 }));
    }
  }, [dispatch, status]);

  const sections = useMemo(
    () => buildSectionBuckets(posts || [], tagPages, savedUrls),
    [posts, tagPages, savedUrls],
  );

  const loadTagPage = useCallback(
    async (tag) => {
      const cache = tagPages?.[tag];
      const currentPage = cache?.page ?? 0;
      const totalPages = cache?.totalPages ?? 1;

      if (currentPage >= totalPages) return;

      setLoadingTag((prev) => ({ ...prev, [tag]: true }));

      try {
        await dispatch(
          fetchPostsByTag({ tag, status: "published", page: currentPage + 1 }),
        ).unwrap();
      } catch (err) {
        console.error("[loadTagPage]", err);
        toast.error(err?.message || "Failed to load more images");
      } finally {
        setLoadingTag((prev) => ({ ...prev, [tag]: false }));
      }
    },
    [dispatch, tagPages],
  );

  const onDrop = useCallback(
    async (files) => {
      if (!authorized) {
        toast.error("You are not authorized to upload images.");
        return;
      }

      if (!files?.length) return;

      setUploading(true);

      try {
        const results = await uploadImagesPublic(files);

        if (!Array.isArray(results)) {
          throw new Error("Unexpected upload response");
        }

        const uploadedUrls = results
          .map((item) => item?.url)
          .filter((url) => typeof url === "string" && url.trim());

        if (!uploadedUrls.length) {
          throw new Error("No valid upload URLs were returned");
        }

        const merged = Array.from(new Set([...savedUrls, ...uploadedUrls]));
        setSavedUrls(merged);
        writeJSON(LOCAL_STORAGE_KEY, merged);

        toast.success("Upload successful");
      } catch (err) {
        console.error(err);
        toast.error(err?.message || "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [authorized, savedUrls],
  );

  const openSectionSlideshow = useCallback((sectionName, startIndex = 0) => {
    setActiveSection(sectionName);
    setLightboxIndex(startIndex);
    setLightboxOpen(true);
  }, []);

  const activeSlides = useMemo(
    () =>
      (sections?.[activeSection] || []).map((photo) => ({
        src: photo.src,
        alt: photo.title || "Gallery image",
      })),
    [activeSection, sections],
  );

  return (
    <BlogLayout activeMenu="Gallery">
      <div className="mx-auto max-w-7xl p-4 sm:p-6">
        <div className="mb-6 flex flex-col gap-4 rounded-2xl border bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Blog Gallery</h1>
            <p className="text-sm text-gray-500">
              Organized by primary tags, with a separate section for other posts
              and saved uploads.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => openSectionSlideshow("Journals", 0)}
              className="rounded-lg border bg-white px-4 py-2 text-sm transition hover:bg-gray-50"
            >
              Journals Slideshow
            </button>

            <button
              type="button"
              onClick={() => openSectionSlideshow("Events", 0)}
              className="rounded-lg border bg-white px-4 py-2 text-sm transition hover:bg-gray-50"
            >
              Events Slideshow
            </button>

            <Dropzone
              onDrop={onDrop}
              multiple
              accept={{ "image/*": [] }}
              disabled={uploading || !authorized}
            >
              {({ getRootProps, getInputProps }) => (
                <div {...getRootProps()} className="inline-block">
                  <input {...getInputProps()} />
                  <button
                    type="button"
                    className={`rounded-lg px-4 py-2 text-sm transition ${
                      uploading || !authorized
                        ? "cursor-not-allowed bg-gray-300 text-gray-600"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                    aria-disabled={uploading || !authorized}
                  >
                    {uploading
                      ? "Uploading…"
                      : authorized
                        ? "Upload images"
                        : "Not authorized"}
                  </button>
                </div>
              )}
            </Dropzone>
          </div>
        </div>

        {status === "loading" ? (
          <Loading />
        ) : (
          <div>
            {SECTION_CONFIG.filter(
              (section) => section.key !== "Other" && section.key !== "Saved",
            ).map(({ key }) => {
              const photos = sections[key] || [];
              const cache = tagPages?.[key];
              const moreAvailable = cache
                ? (cache.page ?? 0) < (cache.totalPages ?? 1)
                : true;

              return (
                <GallerySection
                  key={key}
                  title={key}
                  photos={photos}
                  onImageClick={(idx) => openSectionSlideshow(key, idx)}
                  onLoadMore={() => loadTagPage(key)}
                  loadingMore={!!loadingTag[key]}
                  moreAvailable={moreAvailable}
                />
              );
            })}

            <GallerySection
              title="Other"
              photos={sections.Other || []}
              onImageClick={(idx) => openSectionSlideshow("Other", idx)}
            />

            <GallerySection
              title="Saved"
              photos={sections.Saved || []}
              onImageClick={(idx) => openSectionSlideshow("Saved", idx)}
            />
          </div>
        )}

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
                  alt={slide.alt || ""}
                  crossOrigin="anonymous"
                  className="h-full w-full object-contain"
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
