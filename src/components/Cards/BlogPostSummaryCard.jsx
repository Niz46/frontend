import { LuEye, LuHeart, LuTrash2 } from "react-icons/lu";

const BlogPostSummaryCard = ({
  title,
  imgUrl,
  videoUrl,
  updatedOn,
  tags = [],
  likes,
  views,
  onClick,
  onDelete,
}) => {
  // Only show up to 7 tags
  const displayedTags = tags.slice(0, 6);

  return (
    <div
      className="flex items-start gap-4 bg-white p-3 mb-5 rounded-lg cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex flex-col gap-1">
        {imgUrl && (
          <img
            src={imgUrl}
            alt={title}
            className="w-16 h-16 rounded-lg object-cover"
            crossOrigin="anonymous"
          />
        )}
        {videoUrl && (
          <video
            src={videoUrl}
            className="w-16 h-16 rounded-lg object-cover"
            crossOrigin="anonymous"
            playsInline
          />
        )}
      </div>

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

          <div className="flex items-center gap-2">
            {displayedTags.map((tag, index) => (
              <div
                className="text-xs text-cyan-700 font-medium bg-cyan-100/50 px-2.5 py-1 rounded"
                key={`tag_${index}`}
              >
                {tag}
              </div>
            ))}
            {/* Optionally show “…+n more” */}
            {tags.length > displayedTags.length && (
              <div className="text-xs text-gray-500 font-medium">
                +{tags.length - displayedTags.length} more
              </div>
            )}
          </div>
        </div>
      </div>

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
  );
};

export default BlogPostSummaryCard;
