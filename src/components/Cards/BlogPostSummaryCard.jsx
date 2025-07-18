// src/components/Cards/BlogPostSummaryCard.jsx
import { useState, useCallback } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import { LuEye, LuHeart, LuTrash2 } from "react-icons/lu";
import MultiPreviewGrid from "../MultiPreviewGrid";

const BlogPostSummaryCard = ({
  title,
  imgUrls = [],      // now an array of strings
  videoUrl,
  updatedOn,
  tags = [],
  likes,
  views,
  onClick,
  onDelete,
}) => {
  const displayedTags = tags.slice(0, 6);

  // Lightbox state
  const [slideshowOpen, setSlideshowOpen] = useState(false);
  const [slideshowIndex, setSlideshowIndex] = useState(0);

  // Open at clicked index
  const openSlideshowAt = useCallback((idx) => {
    setSlideshowIndex(idx);
    setSlideshowOpen(true);
  }, []);

  // Build slides array for Lightbox
  const slides = imgUrls.map((src) => ({ src }));

  return (
    <>
      <div
        className="flex flex-wrap items-start gap-4 bg-white p-3 mb-5 rounded-lg cursor-pointer group"
        onClick={onClick}
      >
        {/* MEDIA PREVIEW */}
        <div className="flex-shrink-0">
          {imgUrls.length > 1 ? (
            <div onClick={(e) => e.stopPropagation()}>
              <MultiPreviewGrid
                urls={imgUrls}
                onItemClick={openSlideshowAt}
              />
            </div>
          ) : imgUrls.length === 1 ? (
            <img
              src={imgUrls[0]}
              alt={title}
              className="w-16 h-16 rounded-lg object-cover"
              crossOrigin="anonymous"
              onClick={(e) => {
                e.stopPropagation();
                openSlideshowAt(0);
              }}
            />
          ) : videoUrl ? (
            <video
              src={videoUrl}
              className="w-16 h-16 rounded-lg object-cover"
              crossOrigin="anonymous"
              playsInline
              onClick={(e) => e.stopPropagation()}
            />
          ) : null}
        </div>

        {/* TEXT & STATS */}
        <div className="flex-1">
          <h3 className="text-[13px] md:text-[15px] text-black font-medium">
            {title}
          </h3>

          <div className="flex items-center gap-2.5 mt-2 flex-wrap">
            <div className="text-[11px] text-gray-700 font-medium bg-gray-100 px-2.5 py-1 rounded-lg">
              Updated: {updatedOn}
            </div>

            <div className="h-6 w-[1px] bg-gray-300/70" />

            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs text-sky-700 font-medium bg-sky-50 px-2.5 py-1 rounded-lg">
                <LuEye className="text-[16px] text-sky-500" /> {views}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-sky-700 font-medium bg-sky-50 px-2.5 py-1 rounded">
                <LuHeart className="text-[16px] text-sky-500" /> {likes}
              </span>
            </div>

            <div className="h-6 w-[1px] bg-gray-300/70" />

            <div className="flex flex-wrap items-center gap-2">
              {displayedTags.map((tag, idx) => (
                <div
                  key={idx}
                  className="text-xs text-cyan-700 font-medium bg-cyan-100/50 px-2.5 py-1 rounded"
                >
                  {tag}
                </div>
              ))}
              {tags.length > displayedTags.length && (
                <div className="text-xs text-gray-500 font-medium">
                  +{tags.length - displayedTags.length} more
                </div>
              )}
            </div>
          </div>
        </div>

        {/* DELETE BUTTON */}
        <button
          className="hidden md:group-hover:flex items-center gap-2 text-xs text-rose-500 font-medium bg-rose-50 px-3 py-1 rounded border border-rose-100 hover:border-rose-200 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <LuTrash2 /> <span className="hidden md:block">Delete</span>
        </button>
      </div>

      {/* LIGHTBOX */}
      {slideshowOpen && (
        <Lightbox
          open={slideshowOpen}
          close={() => setSlideshowOpen(false)}
          index={slideshowIndex}
          slides={slides}
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
    </>
  );
};

export default BlogPostSummaryCard;
