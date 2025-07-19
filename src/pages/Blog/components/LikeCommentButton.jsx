import { useEffect, useState } from "react";
import { PiHeart } from "react-icons/pi";
import { LuMessageCircleDashed } from "react-icons/lu";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPath";
import clsx from "clsx";

const LikeCommentButton = ({
  postSlug,
  postId,
  initialLikes = 0,
  initialComments = 0,
}) => {
  const [postLikes, setPostLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(false);
  const [likeStatusLoaded, setLikeStatusLoaded] = useState(false); // 👈

  // Fetch hasLiked status
  useEffect(() => {
    if (!postSlug) return;

    (async () => {
      try {
        const { data } = await axiosInstance.get(
          API_PATHS.POSTS.GET_BY_SLUG(postSlug)
        );
        setHasLiked(Boolean(data.hasLiked));
      } catch (err) {
        console.error("Could not fetch like status:", err);
      } finally {
        setLikeStatusLoaded(true); // 👈 mark as loaded
      }
    })();
  }, [postSlug]);

  const handleLikeClick = async () => {
    if (hasLiked || !postId) return;

    try {
      const { data } = await axiosInstance.post(API_PATHS.POSTS.LIKE(postId));
      setPostLikes(data.likes ?? postLikes);
      if (data.message === "Like added") {
        setHasLiked(true);
      }
    } catch (error) {
      console.error("Error liking the post:", error);
    }
  };

  // Avoid flicker: only render when like status is known
  if (!likeStatusLoaded) return null;

  return (
    <div className="fixed bottom-8 right-8 px-6 py-3 bg-black text-white rounded-full shadow-lg flex items-center space-x-6">
      <button
        className="flex items-center gap-2 disabled:cursor-not-allowed"
        onClick={handleLikeClick}
        disabled={hasLiked}
      >
        <PiHeart
          className={clsx(
            "text-[22px] transition-transform duration-300",
            hasLiked ? "scale-125 text-pink-500" : "hover:text-cyan-500"
          )}
        />
        <span className="text-base font-medium">{postLikes}</span>
      </button>

      <div className="h-6 w-px bg-gray-500" />

      <button className="flex items-center gap-2">
        <LuMessageCircleDashed className="text-[22px]" />
        <span className="text-base font-medium">{initialComments}</span>
      </button>
    </div>
  );
};

export default LikeCommentButton;
