import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import toast from "react-hot-toast";
import { LuChevronDown, LuDot, LuReply } from "react-icons/lu";

import axiosInstance from "../../utils/axiosInstance";
import { setOpenAuthForm } from "../../store/slices/authSlice";
import { API_PATHS } from "../../utils/apiPath";
import CommentReplyInput from "../Inputs/CommentReplyInput";

const CommentInfoCard = ({
  commentId,
  authorName,
  authorPhoto,
  content,
  updatedOn,
  post, // may be { id, _id, slug } or a post object from server
  replies,
  getAllComments,
  onDelete,
  isSubReply,
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [replyText, setReplyText] = useState("");
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showSubReplies, setShowSubReplies] = useState(false);

  const handleCancelReply = () => {
    setReplyText("");
    setShowReplyForm(false);
  };

  // derive canonical post identifier (id || _id || slug)
  const getPostIdentifier = () => {
    if (!post) return null;
    return post.id ?? post._id ?? post.slug ?? null;
  };

  const handleAddReply = async () => {
    try {
      const postId = getPostIdentifier();
      if (!postId) {
        toast.error("Unable to determine post id for reply.");
        return;
      }

      await axiosInstance.post(API_PATHS.COMMENTS.ADD(postId), {
        content: replyText,
        parentComment: commentId || null, // send parent comment id for replies
      });

      toast.success("Reply added successfully!");
      setReplyText("");
      setShowReplyForm(false);
      if (typeof getAllComments === "function") {
        await getAllComments();
      }
    } catch (error) {
      console.error("Error adding reply:", error);
      toast.error("Could not add reply. Please try again.");
    }
  };

  return (
    <div className="bg-white p-3 rounded-lg cursor-pointer group mb-5">
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 md:col-span-8 order-2 md:order-1">
          <div className="flex items-start gap-3">
            <img
              src={authorPhoto}
              alt={authorName}
              crossOrigin="anonymous"
              className="w-10 h-10 rounded-full"
            />

            <div className="flex-1">
              <div className="flex items-center gap-1">
                <h3 className="text-[12px] text-gray-500 font-medium">
                  @{authorName}
                </h3>
                <LuDot className="text-gray-500" />
                <span className="text-[12px] text-gray-500 font-medium">
                  {updatedOn}
                </span>
              </div>

              <p className="text-sm text-black font-medium">{content}</p>

              <div className="flex items-center gap-3 mt-1.5">
                {!isSubReply && (
                  <>
                    <button
                      className="flex items-center gap-2 text-[13px] font-medium text-sky-600 bg-sky-50 px-4 py-0.5 rounded-full hover:bg-sky-500 hover:text-white cursor-pointer"
                      onClick={() => {
                        if (!user) {
                          dispatch(setOpenAuthForm(true));
                          return;
                        }
                        setShowReplyForm((prev) => !prev);
                      }}
                    >
                      <LuReply /> Reply
                    </button>
                    <button
                      className="flex items-center gap-2 text-[13px] font-medium text-sky-600 bg-sky-50 px-4 py-0.5 rounded-full hover:bg-sky-500 hover:text-white cursor-pointer"
                      onClick={() => setShowSubReplies((prev) => !prev)}
                    >
                      {replies?.length || 0}{" "}
                      {replies?.length === 1 ? "reply" : "replies"}{" "}
                      <LuChevronDown
                        className={showSubReplies ? "rotate-180" : ""}
                      />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {!isSubReply && showReplyForm && (
        <CommentReplyInput
          user={user}
          authorName={authorName}
          content={content}
          replyText={replyText}
          setReplyText={setReplyText}
          handleAddReply={handleAddReply}
          handleCancelReply={handleCancelReply}
        />
      )}

      {showSubReplies &&
        replies?.length > 0 &&
        replies.map((reply, idx) => (
          <div
            className={`ml-5 ${idx === 0 ? "mt-5" : ""}`}
            key={reply._id || reply.id}
          >
            <CommentInfoCard
              commentId={reply._id || reply.id}
              authorName={reply.author.name}
              authorPhoto={reply.author.profileImageUrl}
              content={reply.content}
              updatedOn={
                reply.updatedAt
                  ? moment(reply.updatedAt).format("Do MMM YYYY")
                  : "-"
              }
              post={reply.post || post}
              replies={reply.replies || []}
              getAllComments={getAllComments}
              onDelete={onDelete}
              isSubReply
            />
          </div>
        ))}
    </div>
  );
};

export default CommentInfoCard;
