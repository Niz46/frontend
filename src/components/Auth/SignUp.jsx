import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import Input from "../Inputs/Input";
import { validateEmail } from "../../utils/helper";
import ProfilePhotoSelector from "../Inputs/ProfilePhotoSelector";
import uploadImage from "../../utils/uploadImage";
import AUTH_IMG from "/OIP.jpg";
import {
  setUser as setUserAction,
  setOpenAuthForm as setOpenAuthFormAction,
} from "../../store/slices/authSlice";

const SignUp = ({ setCurrentPage, showAdminToken = false }) => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminAccessToken, setAdminAccessToken] = useState("");
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    let profileImageUrl = "";

    if (!fullName.trim()) {
      setError("Please enter the full name.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter the password");
      return;
    }
    setError("");

    try {
      if (profilePic) {
        const { imageUrl = "" } = await uploadImage(profilePic);
        profileImageUrl = imageUrl;
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
        profileImageUrl,
        ...(showAdminToken ? { adminAccessToken } : {}),
      });

      const { token, role, ...rest } = response.data;
      if (token) {
        // persist token
        localStorage.setItem("token", token);

        // update Redux auth state
        dispatch(
          setUserAction({
            token,
            role,
            ...rest,
          })
        );
        dispatch(setOpenAuthFormAction(false));

        // redirect based on role
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || "Something went wrong. Try again later";
      setError(msg);
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
              onChange={({ target }) => setFullName(target.value)}
              label="Full Name"
              placeholder="John Doe"
              type="text"
            />

            <Input
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              label="Email"
              placeholder="example@gmail.com"
              type="text"
            />

            <Input
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              label="Password"
              placeholder="Min 8 characters"
              type="password"
            />

            {showAdminToken && (
              <Input
                value={adminAccessToken}
                onChange={({ target }) => setAdminAccessToken(target.value)}
                label="Admin Token"
                placeholder="Access Code"
                type="text"
              />
            )}
          </div>

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button type="submit" className="btn-primary">
            Sign Up
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            Already have an account{" "}
            <button
              type="button"
              className="font-medium text-[16px] text-priamry underline cursor-pointer"
              onClick={() => setCurrentPage("login")}
            >
              Log In
            </button>
          </p>
        </form>
      </div>

      <div className="hidden md:block">
        <img src={AUTH_IMG} alt="signup" className="h-[520px] w-[33vw]" />
      </div>
    </div>
  );
};

export default SignUp;
