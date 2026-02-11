// src/components/MultiPreviewGrid.jsx
import React from "react";

/**
 * Renders up to 4 previews in a small grid.
 *
 * Props:
 * - urls: string[]  (array of image/video URLs)
 * - isVideo: boolean
 * - onImageClick / onItemClick: (index) => void
 * - size: number (px). If omitted, defaults to 64 (h-16 / w-16)
 * - className: optional additional classes for the container
 */
const MultiPreviewGrid = ({
  urls = [],
  isVideo = false,
  onImageClick,
  onItemClick,
  size = 64,
  className = "",
}) => {
  const display = urls.slice(0, 4);
  const extra = Math.max(0, urls.length - 4);

  // grid classes based on count (keeps same visual arrangement, but inside fixed box)
  let gridClass = "grid gap-1";
  if (display.length === 2) gridClass += " grid-cols-2";
  else if (display.length === 3) gridClass += " grid-cols-2 grid-rows-2";
  else if (display.length === 4) gridClass += " grid-cols-2 grid-rows-2";
  else gridClass += " grid-cols-1";

  // choose handler (compatibility)
  const handleClick = (idx) => {
    const handler = onImageClick || onItemClick;
    if (typeof handler === "function") handler(idx);
  };

  // wrapper inline size (use numbers for px)
  const wrapperStyle = { width: size, height: size };

  return (
    <div
      className={`${gridClass} ${className}`}
      style={{
        ...wrapperStyle,
        // ensure the content doesn't stretch: let grid items fit the square
        display: "grid",
        gridTemplateColumns:
          display.length === 1
            ? "1fr"
            : display.length === 2
              ? "1fr 1fr"
              : undefined,
      }}
    >
      {display.map((url, i) => {
        const spanClass = display.length === 3 && i === 0 ? "row-span-2" : "";
        return (
          <div
            key={i}
            className={`relative overflow-hidden ${spanClass}`}
            onClick={(e) => {
              e.stopPropagation();
              handleClick(i);
            }}
            style={{
              // ensure each cell occupies correct fraction
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          >
            {isVideo ? (
              <video
                src={url}
                className="w-full h-full object-cover rounded"
                muted
                controls={false}
                playsInline
                crossOrigin="anonymous"
              />
            ) : (
              <img
                src={url}
                className="w-full h-full object-cover rounded"
                alt={`preview-${i}`}
                crossOrigin="anonymous"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/profile-1.jpg"; // fallback
                }}
              />
            )}

            {i === 3 && extra > 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-sm font-bold rounded">
                +{extra}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MultiPreviewGrid;
