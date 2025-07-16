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
      <div className="w-screen h-[90vh] overflow-hidden relative -left-16 -top-7">
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
            <div className="absolute inset-0 bg-[rgba(0,0,0,0.7)] backdrop-blur-md z-0" />

            <div className="flex w-full max-w-7xl h-[80vh] gap-2 items-center justify-center z-10 p-4">
              {panels.map((panel, idx) => (
                <div
                  key={idx}
                  onClick={() => handleClick(idx)}
                  className={`
                    h-full rounded-2xl bg-white cursor-pointer
                    transition-all duration-500 ease-in-out overflow-hidden
                    ${
                      expandedIndex === idx
                        ? "w-[60%]"
                        : "w-[10%] hover:bg-gray-200"
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
