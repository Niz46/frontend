// src/components/Auth/SignUp.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import ProfilePhotoSelector from "../Inputs/ProfilePhotoSelector";
import uploadImages from "../../utils/uploadImage";
import Input from "../Inputs/Input";
import { validateEmail } from "../../utils/helper";
import {
  setUser as setUserAction,
  setOpenAuthForm as setOpenAuthFormAction,
} from "../../store/slices/authSlice";
import AUTH_IMG from "/OIP.jpg";

const SignUp = ({ setCurrentPage, showAdminToken = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // form state
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminAccessToken, setAdminAccessToken] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);

    // basic validation
    if (!fullName.trim()) return setError("Please enter your full name.");
    if (!validateEmail(email)) return setError("Please enter a valid email.");
    if (!password) return setError("Please enter a password.");

    setLoading(true);

    try {
      // 1) upload image if selected
      let profileImageUrl = null;
      if (profilePic instanceof File) {
        const [result] = await uploadImages(profilePic);
        profileImageUrl = result.url;
      }

      // 2) send registration
      const payload = {
        name: fullName,
        email,
        password,
        profileImageUrl,
        ...(showAdminToken && { adminAccessToken }),
      };
      const response = await axiosInstance.post(
        API_PATHS.AUTH.REGISTER,
        payload
      );

      // 3) persist token & user
      const { token, role, ...userData } = response.data;
      localStorage.setItem("token", token);
      dispatch(setUserAction({ token, role, ...userData }));
      dispatch(setOpenAuthFormAction(false));

      // 4) navigate based on role
      navigate(role === "admin" ? "/admin/dashboard" : "/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center h-auto md:h-[520px]">
      <div className="w-[90vw] md:w-[43vw] p-7 flex flex-col justify-center">
        <h3 className="text-lg font-semibold text-black">Create an Account</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Join us today by entering your details
        </p>

        <form onSubmit={handleSignUp}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              label="Full Name"
              placeholder="John Doe"
            />

            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Email"
              placeholder="example@gmail.com"
              type="email"
            />

            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
              placeholder="Min 8 characters"
              type="password"
            />

            {showAdminToken && (
              <Input
                value={adminAccessToken}
                onChange={(e) => setAdminAccessToken(e.target.value)}
                label="Admin Token"
                placeholder="Access Code"
              />
            )}
          </div>

          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary mt-4">
            {loading ? "Signing up…" : "Sign Up"}
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            Already have an account?{" "}
            <button
              type="button"
              className="font-medium text-primary underline"
              onClick={() => setCurrentPage("login")}
            >
              Log In
            </button>
          </p>
        </form>
      </div>

      <div className="hidden md:block">
        <img
          src={AUTH_IMG}
          alt="signup"
          className="h-[520px] w-[33vw] object-cover"
        />
      </div>
    </div>
  );
};

export default SignUp;
