import {
  LuLayoutDashboard,
  LuGalleryVerticalEnd,
  LuBook,
  LuMessageSquareQuote,
  LuAlbum,
  LuLayoutTemplate,
  LuTag,
  LuUser,
} from "react-icons/lu";

export const SIDE_MENU_DATA = [
  {
    id: "01",
    label: "Dashboard",
    icon: LuLayoutDashboard,
    path: "/admin/dashboard",
  },

  {
    id: "02",
    label: "Blog Posts",
    icon: LuGalleryVerticalEnd,
    path: "/admin/posts",
  },

  {
    id: "03",
    label: "Comments",
    icon: LuMessageSquareQuote,
    path: "/admin/comments",
  },

  {
    id: "04",
    label: "Users",
    icon: LuUser,
    path: "/admin/users",
  },
];

export const BLOG_NAVBAR_DATA = [
  {
    id: "01",
    label: "Home",
    icon: LuLayoutTemplate,
    path: "/",
  },

  {
    id: "02",
    label: "Gallery",
    icon: LuGalleryVerticalEnd,
    path: "/gallery",
  },

  {
    id: "03",
    label: "About",
    icon: LuAlbum,
    path: "/about",
  },

  {
    id: "04",
    label: "Journals",
    icon: LuBook,
    path: "/tag/Journals",
  },

  {
    id: "05",
    label: "Events",
    icon: LuTag,
    path: "/tag/Events",
  },
];
