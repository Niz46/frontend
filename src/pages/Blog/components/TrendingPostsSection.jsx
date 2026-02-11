import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPath";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { resolveMediaUrl } from "../../../utils/helper";

const TrendingPostsSection = () => {
  const navigate = useNavigate();
  const [postList, setPostList] = useState([]);

  const getTrendingPosts = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.POSTS.GET_TRENDING_POSTS,
      );
      const posts = Array.isArray(response.data)
        ? response.data
        : (response.data?.posts ?? []);
      setPostList(posts);
    } catch (error) {
      console.error("Error fetching data:", error);
      setPostList([]);
    }
  };

  useEffect(() => {
    getTrendingPosts();
  }, []);

  return (
    <div>
      <h4 className="text-base text-black font-bold mb-3">Recent Posts</h4>

      {postList.length > 0 ? (
        postList.map((item) => (
          <PostCard
            key={item.id || item._id}
            title={item.title}
            coverImageUrl={item.coverImageUrl}
            tags={item.tags || []}
            onClick={() => navigate(`/${item.slug}`)}
          />
        ))
      ) : (
        <p className="text-sm text-gray-500">No trending posts</p>
      )}
    </div>
  );
};

export default TrendingPostsSection;

const PostCard = ({ title, coverImageUrl, tags = [], onClick }) => {
  const firstTag = tags.length ? tags[0] : null;

  return (
    <div className="cursor-pointer mb-3" onClick={onClick}>
      <h6 className="text-[11px] font-medium text-sky-500">
        {(firstTag && firstTag.toUpperCase()) || "BLOG"}
      </h6>

      <div className="flex items-start gap-4 mt-2">
        <img
          src={resolveMediaUrl(coverImageUrl)}
          alt={title}
          crossOrigin="anonymous"
          className="w-14 h-14 object-cover rounded"
        />

        <h2 className="text-sm md:text-sm font-medium mb-2 line-clamp-3">
          {title}
        </h2>
      </div>
    </div>
  );
};
