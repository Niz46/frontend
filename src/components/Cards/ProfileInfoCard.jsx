// src/components/Cards/ProfileInfoCard.jsx
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout as logoutAction } from "../../store/slices/authSlice";
import { resolveMediaUrl } from "../../utils/helper";

const ProfileInfoCard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Pull `user` from Redux instead of context
  const user = useSelector((state) => state.auth.user);

  // If there's no user in state, render nothing (or a placeholder)
  if (!user) return null;

  const handleLogout = () => {
    // Clear persisted token
    localStorage.removeItem("token");

    // Reset Redux state
    dispatch(logoutAction());

    // Redirect home
    navigate("/");
  };

  const avatarSrc = user.profileImageUrl;

  return (
    <div className="flex items-center">
      {avatarSrc ? (
        <img
          src={resolveMediaUrl(avatarSrc)}
          alt="profile"
          className="w-11 h-11 bg-gray-300 rounded-full mr-3 object-cover"
        />
      ) : (
        <div className="w-11 h-11 bg-gray-300 rounded-full mr-3 flex items-center justify-center text-white">
          {user.name?.charAt(0).toUpperCase() || "U"}
        </div>
      )}

      <div>
        <div className="text-[15px] text-black font-bold leading-3">
          {user.name}
        </div>
        <button
          onClick={handleLogout}
          className="text-sky-600 text-sm font-semibold cursor-pointer hover:underline"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default ProfileInfoCard;
