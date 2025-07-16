// src/pages/BlogLandingPage.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { LuGalleryHorizontalEnd, LuLoaderCircle } from "react-icons/lu";

import BlogLayout from "../../components/layouts/BlogLayout/BlogLayout";
import FeaturedBlogPost from "./components/FeaturedBlogPost";
import BlogPostSummaryCard from "./components/BlogPostSummaryCard";
import TrendingPostsSection from "./components/TrendingPostsSection";

import { useSelector, useDispatch } from "react-redux";
import { fetchPosts, removeLastPage } from "../../store/slices/blogSlice";

const BlogLandingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Pull state from Redux
  const posts = useSelector((state) => state.blog.posts);
  const page = useSelector((state) => state.blog.page);
  const totalPages = useSelector((state) => state.blog.totalPages);
  const status = useSelector((state) => state.blog.status);
  const error = useSelector((state) => state.blog.error);

  // On mount, fetch first page if idle
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchPosts({ status: "published", page: 1 }));
    }
  }, [dispatch, status]);

  const handleLoadMore = () => {
    if (page < totalPages && status !== "loading") {
      dispatch(fetchPosts({ status: "published", page: page + 1 }));
    }
  };

  const handleShowLess = () => {
    if (page > 1) {
      dispatch(removeLastPage());
    }
  };

  const handleClick = (post) => {
    navigate(`/${post.slug}`);
  };

  return (
    <BlogLayout activeMenu="Home">
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 md:col-span-9">
          {/* Featured */}
          {posts.length > 0 && (
            <FeaturedBlogPost
              title={posts[0].title}
              coverImageUrl={posts[0].coverImageUrl}
              description={posts[0].content}
              tags={posts[0].tags}
              updatedOn={moment(posts[0].updatedAt).format("Do MMM YYYY")}
              authorName={posts[0].author.name}
              authorProfileImg={posts[0].author.profileImageUrl}
              onClick={() => handleClick(posts[0])}
            />
          )}

          {/* Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {posts.slice(1).map((post) => (
              <BlogPostSummaryCard
                key={post._id}
                title={post.title}
                coverImageUrl={post.coverImageUrl}
                description={post.content}
                tags={post.tags}
                updatedOn={moment(post.updatedAt).format("Do MMM YYYY")}
                authorName={post.author.name}
                authorProfileImg={post.author.profileImageUrl}
                onClick={() => handleClick(post)}
              />
            ))}
          </div>

          {/* Load More */}
          {page < totalPages && (
            <div className="flex items-center justify-center mt-5">
              <button
                className="flex items-center gap-3 text-sm text-white font-medium bg-black px-7 py-2.5 rounded-full hover:scale-105 transition-all cursor-pointer"
                disabled={status === "loading"}
                onClick={handleLoadMore}
              >
                {status === "loading" ? (
                  <LuLoaderCircle className="animate-spin text-[15px]" />
                ) : (
                  <LuGalleryHorizontalEnd className="text-lg" />
                )}
                {status === "loading" ? "Loading..." : "Load More"}
              </button>
            </div>
          )}

          {/* Show Less */}
          {page > 1 && (
            <div className="flex items-center justify-center mt-5">
              <button
                className="flex items-center gap-3 text-sm text-gray-800 font-medium bg-gray-200 px-6 py-2.5 rounded-full hover:bg-gray-300 transition-all cursor-pointer"
                onClick={handleShowLess}
              >
                <LuGalleryHorizontalEnd className="text-lg rotate-180" />
                Show Less
              </button>
            </div>
          )}

          {/* Error */}
          {status === "failed" && (
            <p className="text-center text-red-500 mt-4">{error}</p>
          )}
        </div>
        {/* Sidebar */}
        <div className="mt-10 col-span-12 md:col-span-3">
          <TrendingPostsSection />
        </div>
      </div>
    </BlogLayout>
  );
};

export default BlogLandingPage;
