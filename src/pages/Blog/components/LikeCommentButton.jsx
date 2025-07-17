import { useEffect, useState } from "react";
import { PiHeart } from "react-icons/pi";
import { LuMessageCircleDashed } from "react-icons/lu";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPath";
import clsx from "clsx";

const LikeCommentButton = ({ postId, initialLikes, initialComments }) => {
  const [postLikes, setPostLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(false);

  // 1. On mount, fetch whether user has liked
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axiosInstance.get(
          API_PATHS.POSTS.GET_BY_SLUG(postId)
        );
        setHasLiked(data.hasLiked);
      } catch (err) {
        console.error("Could not fetch like status:", err);
      }
    })();
  }, [postId]);

  // 2. Handler only fires if not yet liked
  const handleLikeClick = async () => {
    if (hasLiked) return;

    try {
      const { data } = await axiosInstance.put(API_PATHS.POSTS.LIKE(postId));
      setPostLikes(data.likes);
      if (data.message === "Like added") {
        setHasLiked(true);
      }
    } catch (error) {
      console.error("Error liking the post:", error);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 px-6 py-3 bg-black text-white rounded-full shadow-lg flex items-center">
      <button
        className="flex items-end gap-2 cursor-pointer"
        onClick={handleLikeClick}
        disabled={hasLiked}
      >
        <PiHeart
          className={clsx(
            "text-[22px] transition-transform duration-300",
            hasLiked ? "scale-125 text-gray-500" : "hover:text-cyan-500"
          )}
        />
        <span className="text-base font-medium leading-4">{postLikes}</span>
      </button>

      <div className="h-6 w-px bg-gray-500 mx-5"></div>

      <button className="flex items-end gap-2">
        <LuMessageCircleDashed className="text-[22px]" />
        <span className="text-base font-medium leading-4">
          {initialComments}
        </span>
      </button>
    </div>
  );
};

export default LikeCommentButton;
