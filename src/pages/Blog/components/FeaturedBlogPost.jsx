const FeaturedBlogPost = ({
  title,
  coverImageUrl,
  //   coverVideoUrl,
  description,
  tags = [],
  updatedOn,
  authorName,
  authorProfileImg,
  onClick,
}) => {
  return (
    <div
      className="grid grid-cols-12 bg-white shadow-lg shadow-gray-100 rounded-xl overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      <div className="col-span-6">
        <img
          src={coverImageUrl}
          alt={title}
          crossOrigin="anonymous"
          className="w-full h-80 object-cover"
        />
        {/* <video src={resolveMediaUrl(coverVideoUrl)} className="w-full h-80 object-cover"></video> */}
      </div>

      <div className="col-span-6">
        <div className="p-6">
          <h2 className="text-lg md:text-2xl font-bold mb-2 line-clamp-3">
            {title}
          </h2>
          <p className="text-gray-700 text-[13px] mb-4 line-clamp-3">
            {description}
          </p>

          <div className="flex items-center flex-wrap gap-2 mb-4">
            {tags.slice(0, 4).map((tag, index) => (
              <span
                className="bg-sky-200/50 text-sky-800/80 text-xs font-medium px-3 py-0.5 rounded-full text-nowrap"
                key={index}
              >
                # {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center">
            <img
              src={authorProfileImg}
              alt={authorName}
              crossOrigin="anonymous"
              className="w-8 h-8 rounded-full mr-2"
            />

            <div className="">
              <p className="text-gray-600 text-sm">{authorName}</p>
              <p className="text-gray-500 text-xs">{updatedOn}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedBlogPost;
