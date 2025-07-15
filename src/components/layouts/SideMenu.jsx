// src/components/Navbar/SideMenu.jsx
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LuLogOut } from "react-icons/lu";

import { BLOG_NAVBAR_DATA, SIDE_MENU_DATA } from "../../utils/data";
import CardAvatar from "../Cards/CardAvatar";
import { logout as logoutAction } from "../../store/slices/authSlice";
import { resolveMediaUrl } from "../../utils/helper";

const SideMenu = ({ activeMenu, isBlogMenu, setOpenSideMenu }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Pull `user` from Redux instead of context
  const user = useSelector((state) => state.auth.user);

  const handleClick = (route) => {
    if (route === "logout") {
      handleLogout();
      return;
    }
    setOpenSideMenu((prev) => !prev);
    navigate(route);
  };

  const handleLogout = () => {
    // Clear persisted token
    localStorage.removeItem("token");

    // Reset Redux state
    dispatch(logoutAction());

    // Close the menu and navigate home
    setOpenSideMenu((prev) => !prev);
    navigate("/");
  };

  const menuItems = isBlogMenu ? BLOG_NAVBAR_DATA : SIDE_MENU_DATA;

  return (
    <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 p-5 sticky top-[61px] z-20">
      {user && (
        <div className="flex flex-col items-center justify-center gap-1 mt-3 mb-7">
          {user.profileImageUrl ? (
            <img
              src={resolveMediaUrl(user.profileImageUrl)}
              alt="avatar"
              className="w-20 h-20 bg-slate-400 rounded-full object-cover"
            />
          ) : (
            <CardAvatar
              fullName={user.name}
              width="w-20"
              height="h-20"
              style="text-xl"
            />
          )}

          <div className="text-center">
            <h5 className="text-gray-950 font-semibold leading-6 mt-1">
              {user.name}
            </h5>
            <p className="text-[13px] font-medium text-gray-880">
              {user.email}
            </p>
          </div>
        </div>
      )}

      {menuItems.map((item) => (
        <button
          key={item.id}
          className={`w-full flex items-center gap-4 text-[15px] py-3 px-6 rounded-lg mb-3 cursor-pointer ${
            activeMenu === item.label
              ? "text-white bg-linear-to-r from-sky-500 to-cyan-400"
              : ""
          }`}
          onClick={() => handleClick(item.path)}
        >
          <item.icon className="text-xl" />
          {item.label}
        </button>
      ))}

      {user && (
        <button
          className="w-full flex items-center gap-4 text-[15px] py-3 px-6 rounded-lg mb-3 cursor-pointer"
          onClick={handleLogout}
        >
          <LuLogOut className="text-xl" />
          Logout
        </button>
      )}
    </div>
  );
};

export default SideMenu;
