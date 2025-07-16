// src/App.jsx
import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BlogLandingPage from "./pages/Blog/BlogLandingPage";
import BlogPostViews from "./pages/Blog/BlogPostViews";
import PostByTags from "./pages/Blog/PostByTags";
import SearchPosts from "./pages/Blog/SearchPosts";
import BlogPostGallery from "./pages/Blog/BlogPostGallery";

import AdminLogin from "./pages/Admin/AdminLogin";
import PrivateRoutes from "./routes/PrivateRoutes";
import Dashboard from "./pages/Admin/Dashboard";
import BlogPosts from "./pages/Admin/BlogPosts";
import BlogPostEditor from "./pages/Admin/BlogPostEditor";
import Comments from "./pages/Admin/Comments";
import AdminUsersPage from "./pages/Admin/UsersPage";

const App = () => (
  <Router>
    <Routes>
      {/* Public */}
      <Route path="/" element={<BlogLandingPage />} />
      <Route path="/gallery" element={<BlogPostGallery />} />
      <Route path="/:slug" element={<BlogPostViews />} />
      <Route path="/tag/:tagName" element={<PostByTags />} />
      <Route path="/search" element={<SearchPosts />} />

      {/* Protected Admin */}
      <Route element={<PrivateRoutes allowedRoles={["admin"]} />}>
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/posts" element={<BlogPosts />} />
        <Route path="/admin/create" element={<BlogPostEditor />} />
        <Route
          path="/admin/edit/:postSlug"
          element={<BlogPostEditor isEdit />}
        />
        <Route path="/admin/comments" element={<Comments />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
      </Route>

      {/* Admin login */}
      <Route path="/admin-login" element={<AdminLogin />} />
    </Routes>

    <Toaster
      position="top-right"
      toastOptions={{ style: { fontSize: "13px" } }}
    />
  </Router>
);

export default App;
