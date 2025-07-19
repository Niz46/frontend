/**
 * Renders up to 4 previews in a Twitter/X‑style grid.
 * @param {string[]} urls  Array of image/video URLs
 * @param {boolean} isVideo  If true, renders <video> tags
 */
const MultiPreviewGrid = ({ urls, isVideo = false, onImageClick }) => {
  const display = urls.slice(0, 4);
  const extra = urls.length - 4;

  // grid classes based on count
  let gridClass = "grid gap-1";
  if (display.length === 2) gridClass += " grid-cols-2";
  else if (display.length === 3) gridClass += " grid-cols-2 grid-rows-2";
  else if (display.length === 4) gridClass += " grid-cols-2 grid-rows-2";
  else gridClass += " grid-cols-1";

  return (
    <div className={`${gridClass} w-full aspect-square`}>
      {display.map((url, i) => {
        const spanClass = display.length === 3 && i === 0 ? "row-span-2" : "";
        return (
          <div key={i} className={`relative ${spanClass}`} onClick={onImageClick}>
            {isVideo ? (
              <video
                src={url}
                className="w-full h-full object-cover rounded"
                muted
                controls
                playsInline
                crossOrigin="anonymous"
              />
            ) : (
              <img
                src={url}
                className="w-full h-full object-cover rounded"
                alt={`preview-${i}`}
                crossOrigin="anonymous"
              />
            )}
            {i === 3 && extra > 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-lg font-bold rounded">
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
