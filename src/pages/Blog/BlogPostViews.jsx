// src/pages/Blog/BlogPostViews.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import moment from "moment";
import { LuCircleAlert, LuDot, LuSparkles } from "react-icons/lu";
import toast from "react-hot-toast";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

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
import LikeCommentButton from "./components/LikeCommentButton";

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
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [slideshowOpen, setSlideshowOpen] = useState(false);
  const [slideshowIndex, setSlideshowIndex] = useState(0);

  // 1) Fetch post and comments
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axiosInstance.get(
          API_PATHS.POSTS.GET_BY_SLUG(slug)
        );
        setBlogPostData(data);
        const commentsRes = await axiosInstance.get(
          API_PATHS.COMMENTS.GET_ALL_BY_POST(data._id)
        );
        setComments(commentsRes.data);
      } catch (err) {
        console.error("Error fetching post:", err);
      }
    };
    fetchData();
  }, [slug]);

  // 2) Increment views once per user
  useEffect(() => {
    if (!blogPostData || !user) return;
    const viewKey = `viewed_${user.id}_${blogPostData._id}`;
    if (localStorage.getItem(viewKey)) return;
    axiosInstance
      .post(API_PATHS.POSTS.INCREMENT_VIEW(blogPostData._id))
      .then(() => localStorage.setItem(viewKey, "true"))
      .catch(console.error);
  }, [blogPostData, user]);

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
      const commentsRes = await axiosInstance.get(
        API_PATHS.COMMENTS.GET_ALL_BY_POST(blogPostData._id)
      );
      setComments(commentsRes.data);
    } catch (err) {
      console.error("Error adding comment:", err);
      toast.error("Could not add comment");
    }
  };

  // 4) Generate summary
  const generateBlogSummary = async () => {
    try {
      setErrorMsg("");
      setSummaryContent(null);
      setIsLoadingSummary(true);
      setOpenSummarizeDrawer(true);
      const response = await axiosInstance.post(
        API_PATHS.AI.GENERATE_POST_SUMMARY,
        { content: blogPostData.content || "" }
      );
      setSummaryContent(response.data);
    } catch (err) {
      setErrorMsg("Failed to generate summary. Try again later.");
      console.error("Error generating summary:", err);
    } finally {
      setIsLoadingSummary(false);
    }
  };

  // Show loader until data is ready
  if (!blogPostData) {
    return (
      <BlogLayout activeMenu="Home">
        <SkeletonLoader />
      </BlogLayout>
    );
  }

  // Build media list now that blogPostData is non-null
  const mediaUrls = [
    ...(blogPostData.coverImageUrl || []).map((url) => ({
      url,
      isVideo: false,
    })),
    ...(blogPostData.coverVideoUrl || []).map((url) => ({
      url,
      isVideo: true,
    })),
  ];

  const openAt = (index) => {
    setSlideshowIndex(index);
    setSlideshowOpen(true);
  };

  return (
    <BlogLayout activeMenu="Home">
      <title>{blogPostData.title}</title>
      <meta name="description" content={blogPostData.title} />
      <meta name="og:title" content={blogPostData.title} />
      <meta name="og:image" content={blogPostData.coverImageUrl[0] || ""} />
      <meta name="og:video" content={blogPostData.coverVideoUrl[0] || ""} />
      <meta name="og:type" content="article" />

      <div className="grid grid-cols-12 gap-8 relative">
        {/* Main Content */}
        <div className="col-span-12 md:col-span-8 relative">
          <h1 className="text-lg md:text-2xl font-bold mb-2 line-clamp-3">
            {blogPostData.title}
          </h1>

          <div className="flex items-center gap-1 flex-wrap mt-3 mb-5">
            <span className="text-[13px] text-gray-500 font-medium">
              {moment(blogPostData.updatedAt).format("Do MMM YYYY")}
            </span>
            <LuDot className="text-xl text-gray-400" />

            <div className="flex items-center flex-wrap gap-2">
              {blogPostData.tags.slice(0, 4).map((tag) => (
                <button
                  key={tag}
                  onClick={() => navigate(`/tag/${tag}`)}
                  className="bg-sky-200/50 text-sky-800/80 text-xs font-medium px-3 py-0.5 rounded-full"
                >
                  # {tag}
                </button>
              ))}
            </div>

            <LuDot className="text-xl text-gray-400" />

            <button
              className="flex items-center gap-2 bg-linear-to-r from-sky-500 to-cyan-400 text-xs text-white font-medium px-3 py-0.5 rounded-full hover:scale-[1.02]"
              onClick={generateBlogSummary}
            >
              <LuSparkles /> Summarize Post
            </button>
          </div>

          {/* Dynamic cover‑media section */}
          <div className="mb-6">
            {mediaUrls.length > 1 ? (
              <div className="grid gap-1 grid-cols-2 grid-rows-2 w-full aspect-square">
                {mediaUrls.slice(0, 4).map((m, i) => (
                  <div key={i} className="relative" onClick={() => openAt(i)}>
                    {m.isVideo ? (
                      <video
                        src={m.url}
                        crossOrigin="anonymous"
                        muted
                        controls
                        playsInline
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <img
                        src={m.url}
                        crossOrigin="anonymous"
                        alt={`preview-${i}`}
                        className="w-full h-full object-cover rounded"
                      />
                    )}
                    {i === 3 && mediaUrls.length > 4 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-lg font-bold rounded">
                        +{mediaUrls.length - 4}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-fit flex flex-col md:flex-row gap-2">
                {blogPostData.coverImageUrl[0] && (
                  <img
                    src={blogPostData.coverImageUrl[0]}
                    alt={blogPostData.title}
                    crossOrigin="anonymous"
                    className="w-full md:w-1/2 h-96 object-cover mb-6 rounded-lg"
                    onClick={() => openAt(0)}
                  />
                )}
                {blogPostData.coverVideoUrl[0] && (
                  <video
                    src={blogPostData.coverVideoUrl[0]}
                    className="w-full md:w-1/2 h-96 object-cover mb-6 rounded-lg"
                    controls
                    playsInline
                    muted
                    loop
                    crossOrigin="anonymous"
                    onClick={() =>
                      openAt(blogPostData.coverImageUrl[0] ? 1 : 0)
                    }
                  />
                )}
              </div>
            )}
          </div>

          <MarkdonwContent content={sanitizeMarkdown(blogPostData.content)} />
          <SharePost title={blogPostData.title} />

          {/* Comments Section */}
          <div className="bg-gray-200 p-4 rounded-lg mt-10">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold">Comments</h4>
              <button
                className="flex items-center gap-3 bg-linear-to-r from-sky-500 to-cyan-400 text-xs text-white px-5 py-2 rounded-full hover:bg-black"
                onClick={() => {
                  if (!user) {
                    dispatch(setOpenAuthForm(true));
                  } else {
                    setShowReplyForm(true);
                  }
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
                  replyText={replyText}
                  setReplyText={setReplyText}
                  handleAddReply={handleAddReply}
                  handleCancelReply={() => setShowReplyForm(false)}
                  disableAutoGen
                  type="new"
                />
              </div>
            )}

            {comments.map((comment) => (
              <CommentInfoCard
                key={comment._id}
                commentId={comment._id}
                authorName={comment.author.name}
                authorPhoto={comment.author.profileImageUrl}
                content={comment.content}
                updatedOn={moment(comment.updatedAt).format("Do MMM YYYY")}
                replies={comment.replies || []}
                getAllComments={async () => {
                  const res = await axiosInstance.get(
                    API_PATHS.COMMENTS.GET_ALL_BY_POST(blogPostData._id)
                  );
                  setComments(res.data);
                }}
              />
            ))}
          </div>

          <LikeCommentButton
            postSlug={blogPostData.slug}
            postId={blogPostData._id}
            initialLikes={blogPostData.likes}
            initialComments={comments.length}
          />

          {/* Lightbox Slideshow */}
          {slideshowOpen && (
            <Lightbox
              open={slideshowOpen}
              index={slideshowIndex}
              close={() => setSlideshowOpen(false)}
              slides={mediaUrls.map((m) => ({
                src: m.url,
                type: m.isVideo ? "video" : "image",
              }))}
              render={{
                slide: ({ slide }) => {
                  if (slide.type === "video") {
                    return (
                      <video
                        src={slide.src}
                        crossOrigin="anonymous"
                        controls
                        playsInline
                        muted
                        className="w-full h-full object-contain"
                      />
                    );
                  }
                  return (
                    <img
                      src={slide.src}
                      crossOrigin="anonymous"
                      alt=""
                      className="w-full h-full object-contain"
                    />
                  );
                },
              }}
            />
          )}
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
          <p className="flex items-center gap-2 text-sm text-amber-600">
            <LuCircleAlert /> {errorMsg}
          </p>
        )}
        {isLoadingSummary ? (
          <SkeletonLoader />
        ) : (
          <MarkdonwContent content={summaryContent?.summary || ""} />
        )}
      </Drawer>
    </BlogLayout>
  );
};

export default BlogPostViews;
