const BlogPostIdeaCard = ({ title, description, tags, tone, onSelect }) => {
  return (
    <div
      className="border-b border-gray-100 hover:bg-gray-100/60 px-6 py-5 cursor-pointer"
      onClick={onSelect}
    >
      <h3 className="text-sm text-black font-medium">
        {title}{" "}
        <span className="text-xs text-yellow-900 bg-yellow-100 px-2 py-0.5 rounded">
          {tone}
        </span>
      </h3>
      <p className="text-xs font-medium text-gray-600/70 mt-1">{description}</p>

      <div className="flex flex-wrap items-center gap-2.5 mt-2">
        {tags.map((tag, index) => (
          <div
            className="text-[11px] text-sky-700 font-semibold bg-sky-50 px-2.5 py-1 rounded"
            key={`tag_${index}`}
          >
            {tag}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPostIdeaCard;
