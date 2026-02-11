// src/components/MultiPreviewGrid.jsx
import React from "react";

/**
 * Renders up to 4 previews in a small grid.
 *
 * Props:
 * - urls: string[]  (array of image/video URLs)
 * - isVideo: boolean  (if true, render videos)
 * - onImageClick / onItemClick: (index) => void
 * - size: number | string (px when number, or any CSS size string like "100%", "200px")
 * - className: optional additional classes for the container
 *
 * Behavior:
 * - If size is a number -> treated as px (e.g. 64 -> "64px")
 * - If size is a string -> used as-is
 * - Default size is 64 (px) for backward compatibility
 *
 * The component uses `aspect-ratio` to stay square and lets the parent control width
 * when you pass size="100%".
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

  // grid classes based on count
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

  // prepare size style:
  const sizeValue =
    typeof size === "number" ? `${size}px` : String(size || "64px");

  // wrapper style: width controllable, aspect-ratio to keep it square and responsive.
  const wrapperStyle = {
    width: sizeValue,
    aspectRatio: "1 / 1", // keep square
    display: "grid",
    gridTemplateColumns:
      display.length === 1
        ? "1fr"
        : display.length === 2
          ? "1fr 1fr"
          : undefined,
  };

  return (
    <div
      className={`${gridClass} ${className}`}
      style={wrapperStyle}
      aria-hidden={display.length === 0}
    >
      {display.map((url, i) => {
        // For 3 items, keep first as row-span-2 visually if you want,
        // but row-span requires parent grid rows — Tailwind's row-span can be used.
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
              width: "100%",
              height: "100%",
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
