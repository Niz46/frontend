// src/pages/BlogPostGallery.jsx
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPosts } from "../../store/slices/blogSlice";

import BlogLayout from "../../components/layouts/BlogLayout/BlogLayout";
import Loading from "../../components/Loader/Loading";

const BlogPostGallery = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.blog.posts);
  const status = useSelector((state) => state.blog.status);
  const [expandedIndex, setExpandedIndex] = useState(0);

  // Fetch if idle
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchPosts({ status: "published", page: 1 }));
    }
  }, [dispatch, status]);

  // Build panels
  const panels = posts.map((post) => ({
    image: post.coverImageUrl,
  }));

  const handleClick = (i) => setExpandedIndex(i);

  return (
    <BlogLayout activeMenu="Gallery">
      <div className="w-[98.5vw] h-[86vh] rounded-lg overflow-hidden relative md:-left-16 md:-top-7 -left-4 -top-3">
        {status === "loading" ? (
          <div className="flex items-center justify-center h-full">
            <Loading />
          </div>
        ) : panels.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            No images available.
          </div>
        ) : (
          <div className="relative h-full w-full flex items-center justify-center">
            {/* big preview as <img> so CORS can be handled */}
            <img
              src={panels[expandedIndex].image}
              alt={`Preview ${expandedIndex + 1}`}
              crossOrigin="anonymous"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-[rgba(0,0,0,0.5)] backdrop-blur-md z-0" />

            {/* Thumbnail strip: now horizontally scrollable */}
            <div
              className="
                w-full max-w-7xl h-[65vh] md:h-[80vh] z-10 p-4
                overflow-x-auto overflow-y-hidden
                whitespace-nowrap flex items-center justify-center gap-2
              "
            >
              {panels.map((panel, idx) => (
                <div
                  key={idx}
                  onClick={() => handleClick(idx)}
                  className={`
                    inline-block h-full rounded-2xl bg-gray-500 cursor-pointer
                    transition-all duration-500 ease-in-out overflow-hidden
                    ${
                      expandedIndex === idx
                        ? "w-[85%] md:w-[60%]"
                        : "w-[15%] md:w-[7%] hover:bg-gray-200"
                    }
                    min-w-[40px]
                  `}
                >
                  <img
                    src={panel.image}
                    alt={`Gallery thumbnail ${idx + 1}`}
                    crossOrigin="anonymous"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </BlogLayout>
  );
};

export default BlogPostGallery;
