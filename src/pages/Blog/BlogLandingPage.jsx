// src/pages/Blog/BlogLandingPage.jsx
import { useNavigate } from "react-router-dom";
import BlogLayout from "../../components/layouts/BlogLayout/BlogLayout";

const BlogLandingPage = () => {
  const navigate = useNavigate();

  const handleExplore = () => {
    navigate("/tag/Journals");
  };

  const handleContact = () => {
    navigate("/about");
  };

  return (
    <BlogLayout activeMenu="Home">
      <main className="relative w-full min-h-[calc(100vh-72px)] flex items-center justify-center bg-hero-gradient overflow-hidden">
        <div className="absolute -left-20 -top-16 w-56 h-56 rounded-full opacity-30 blob-1" />
        <div className="absolute -right-24 bottom-8 w-72 h-72 rounded-full opacity-24 blob-2" />
        <section className="relative z-10 flex flex-col items-center gap-6 px-6 text-center">
          <div className="perspective-1200 pointer-events-none">
            <div className="logo-3d-wrapper">
              <img
                src="/UAACAII LOGO.png"
                alt="UAACAII logo"
                className="logo-3d object-contain select-none"
                draggable={false}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-center mt-2">
            <button
              onClick={handleExplore}
              className="btn-primary px-8 py-3 rounded-full shadow-xl transform transition-transform hover:scale-105"
            >
              Explore Journal
            </button>

            <button
              onClick={handleContact}
              className="btn-secondary px-7 py-3 rounded-full border border-sky-200 bg-white/90 text-sky-700 shadow-sm transform transition-transform hover:scale-105"
            >
              Contact
            </button>
          </div>
        </section>

        <div className="absolute inset-0 pointer-events-none bg-vignette" />
      </main>
    </BlogLayout>
  );
};

export default BlogLandingPage;
