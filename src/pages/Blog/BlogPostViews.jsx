// src/pages/Blog/BlogPostViews.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import moment from "moment";
import { LuCircleAlert, LuDot, LuSparkles } from "react-icons/lu";
import toast from "react-hot-toast";

import BlogLayout from "../../components/layouts/BlogLayout/BlogLayout";
import MarkdonwContent from "./components/MarkdonwContent";
import SharePost from "./components/SharePost";
import TrendingPostsSection from "./components/TrendingPostsSection";
import CommentReplyInput from "../../components/Inputs/CommentReplyInput";
import CommentInfoCard from "./components/CommentInfoCard";
import SkeletonLoader from "../../components/Loader/SkeletonLoader";
import Drawer from "../../components/Drawer";
import { sanitizeMarkdown } from "../../utils/helper";
import { setOpenAuthForm } from "../../store/slices/authSlice";

const BlogPostViews = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [blogPostData, setBlogPostData] = useState(null);
  const [comments, setComments] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [openSummarizeDrawer, setOpenSummarizeDrawer] = useState(false);
  const [summaryContent, setSummaryContent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // 1) Fetch post and comments
  const fetchPostDetailsBySlug = async () => {
    try {
      const { data } = await axiosInstance.get(
        API_PATHS.POSTS.GET_BY_SLUG(slug)
      );
      setBlogPostData(data);
      fetchCommentByPostId(data._id);
    } catch (err) {
      console.error("Error fetching post:", err);
    }
  };

  const fetchCommentByPostId = async (postId) => {
    try {
      const { data } = await axiosInstance.get(
        API_PATHS.COMMENTS.GET_ALL_BY_POST(postId)
      );
      setComments(data);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  // 2) Increment views once per user
  const incrementViewsOnce = async (postId) => {
    if (!postId || !user) return;
    const viewKey = `viewed_${user.id}_${postId}`;
    if (localStorage.getItem(viewKey)) return;
    try {
      await axiosInstance.post(API_PATHS.POSTS.INCREMENT_VIEW(postId));
      localStorage.setItem(viewKey, "true");
    } catch (err) {
      console.error("Error incrementing views:", err);
    }
  };

  // 3) Add comment handler
  const handleAddReply = async () => {
    if (!replyText.trim()) return;
    try {
      await axiosInstance.post(API_PATHS.COMMENTS.ADD(blogPostData._id), {
        content: replyText,
        parentComment: "",
      });
      toast.success("Comment added successfully");
      setReplyText("");
      setShowReplyForm(false);
      fetchCommentByPostId(blogPostData._id);
    } catch (err) {
      console.error("Error adding comment:", err);
      toast.error("Could not add comment");
    }
  };

  const handleCancelReply = () => {
    setReplyText("");
    setShowReplyForm(false);
  };

  // 4) Generate summary
  const generateBlogSummary = async () => {
    try {
      setErrorMsg("");
      setSummaryContent(null);
      setIsLoading(true);
      setOpenSummarizeDrawer(true);

      const response = await axiosInstance.post(
        API_PATHS.AI.GENERATE_POST_SUMMARY,
        {
          content: blogPostData.content || "",
        }
      );

      if (response.data) {
        setSummaryContent(response.data);
      }
    } catch (err) {
      setErrorMsg("Failed to generate summary, Try again later");
      console.error("Error generating summary:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPostDetailsBySlug();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  useEffect(() => {
    if (blogPostData && user) {
      incrementViewsOnce(blogPostData._id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blogPostData, user]);

  return (
    <BlogLayout>
      {!blogPostData ? (
        <SkeletonLoader />
      ) : (
        <>
          <title>{blogPostData.title}</title>
          <meta name="description" content={blogPostData.title} />
          <meta name="og:title" content={blogPostData.title} />
          <meta name="og:image" content={blogPostData.coverImageUrl} />
          <meta name="og:video" content={blogPostData.coverVideoUrl} />
          <meta name="og:type" content="article" />

          <div className="grid grid-cols-12 gap-8 relative">
            {/* Main Content */}
            <div className="col-span-12 md:col-span-8 relative">
              <h1 className="text-lg md:text-2xl font-bold mb-2 line-clamp-3">
                {blogPostData.title}
              </h1>

              <div className="flex items-center gap-1 flex-wrap mt-3 mb-5">
                <span className="text-[13px] text-gray-500 font-medium">
                  {moment(blogPostData.updatedAt).format("Do MMM YYYY")}
                </span>
                <LuDot className="text-xl text-gray-400" />

                <div className="flex items-center flex-wrap gap-2">
                  {blogPostData.tags.slice(0, 4).map((tag, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/tag/${tag}`);
                      }}
                      className="bg-sky-200/50 text-sky-800/80 text-xs font-medium px-3 py-0.5 rounded-full cursor-pointer"
                    >
                      # {tag}
                    </button>
                  ))}
                </div>

                <LuDot className="text-xl text-gray-400" />

                <button
                  className="flex items-center gap-2 bg-linear-to-r from-sky-500 to-cyan-400 text-xs text-white font-medium px-3 py-0.5 rounded-full cursor-pointer hover:scale-[1.02] transition-all my-1"
                  onClick={generateBlogSummary}
                >
                  <LuSparkles /> Summarize Post
                </button>
              </div>

              <div className="w-fit flex flex-col md:flex-row gap-2">
                <img
                  src={blogPostData.coverImageUrl}
                  alt={blogPostData.title}
                  className="w-full md:w-1/2 h-96 object-cover mb-6 rounded-lg"
                />
                <video
                  src={blogPostData.coverVideoUrl}
                  className="w-full md:w-1/2 h-96 object-cover mb-6 rounded-lg"
                  controls
                  playsInline
                  muted
                  loop
                />
              </div>

              <div>
                <MarkdonwContent
                  content={sanitizeMarkdown(blogPostData.content)}
                />
                <SharePost title={blogPostData.title} />

                {/* Comments */}
                <div className="bg-gray-200 p-4 rounded-lg mt-10">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold">Comments</h4>
                    <button
                      className="flex items-center justify-center gap-3 bg-linear-to-r from-sky-500 to-cyan-400 text-xs font-semibold text-white px-5 py-2 rounded-full hover:bg-black hover:text-white cursor-pointer"
                      onClick={() => {
                        if (!user) {
                          dispatch(setOpenAuthForm(true));
                          return;
                        }
                        setShowReplyForm(true);
                      }}
                    >
                      Add Comment
                    </button>
                  </div>

                  {showReplyForm && (
                    <div className="bg-white pt-1 pb-5 pr-8 rounded-lg mb-8">
                      <CommentReplyInput
                        user={user}
                        authorName={user.name}
                        content=""
                        replyText={replyText}
                        setReplyText={setReplyText}
                        handleAddReply={handleAddReply}
                        handleCancelReply={handleCancelReply}
                        disableAutoGen
                        type="new"
                      />
                    </div>
                  )}

                  {comments.length > 0 &&
                    comments.map((comment) => (
                      <CommentInfoCard
                        key={comment._id}
                        commentId={comment._id}
                        authorName={comment.author.name}
                        authorPhoto={comment.author.profileImageUrl}
                        content={comment.content}
                        updatedOn={
                          comment.updatedAt
                            ? moment(comment.updatedAt).format("Do MMM YYYY")
                            : "-"
                        }
                        post={comment.post}
                        replies={comment.replies || []}
                        getAllComments={() =>
                          fetchCommentByPostId(blogPostData._id)
                        }
                        onDelete={() => {}}
                      />
                    ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-span-12 md:col-span-4">
              <TrendingPostsSection />
            </div>
          </div>

          {/* Summary Drawer */}
          <Drawer
            isOpen={openSummarizeDrawer}
            onClose={() => setOpenSummarizeDrawer(false)}
            title={summaryContent?.title || ""}
          >
            {errorMsg && (
              <p className="flex gap-2 text-sm text-amber-600 font-medium">
                <LuCircleAlert className="mt-1" />
                {errorMsg}
              </p>
            )}

            {isLoading ? (
              <SkeletonLoader />
            ) : (
              <MarkdonwContent content={summaryContent?.summary || ""} />
            )}
          </Drawer>
        </>
      )}
    </BlogLayout>
  );
};

export default BlogPostViews;
