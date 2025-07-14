// src/routes/PrivateRoutes.jsx
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import Loading from "../components/Loader/Loading";

const PrivateRoutes = ({ allowedRoles }) => {
  // Grab auth.user and auth.openAuthForm (or loading flag if you add one)
  const user    = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading); // optional

  // If you maintain a loading flag in Redux, you can show a loader:
  if (loading) {
    return <Loading />;
  }

  // Not logged in? send to Admin login
  if (!user) {
    return <Navigate to="/admin-login" replace />;
  }

  // Logged in but not in allowedRoles? send to public home
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // Authorized! Render nested routes
  return <Outlet />;
};

export default PrivateRoutes;
