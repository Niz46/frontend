import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import Input from "../Inputs/Input";
import { validateEmail } from "../../utils/helper";
import AUTH_IMG from "/OIP.jpg";

import {
  setUser as setUserAction,
  setOpenAuthForm as setOpenAuthFormAction,
} from "../../store/slices/authSlice";

const Login = ({ setCurrentPage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!password) {
      setError("Please enter a valid password");
      return;
    }

    setError(null);

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token, role, ...rest } = response.data;
      if (token) {
        // Persist to localStorage
        localStorage.setItem("token", token);

        // Update Redux state
        dispatch(setUserAction({ token, role, ...rest }));
        dispatch(setOpenAuthFormAction(false));

        // Navigate based on role
        if (role === "admin") {
          return navigate("/admin/dashboard");
        }
        return; // stays on current page for non‑admin
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Something went wrong. Please try again later";
      setError(msg);
    }
  };

  return (
    <div className="flex items-center">
      <div className="w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center">
        <h3 className="text-lg font-semibold text-black">Welcome Back</h3>
        <p className="text-xs text-slate-700 mt-[2px] mb-6">
          Please enter your details to log in
        </p>

        <form onSubmit={handleLogin}>
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

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button type="submit" className="btn-primary">
            Log In
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            Don’t have an account?{" "}
            <button
              type="button"
              onClick={() => setCurrentPage("signup")}
              className="font-medium text-[16px] text-priamry underline cursor-pointer"
            >
              Sign Up
            </button>
          </p>
        </form>
      </div>

      <div className="hidden md:block">
        <img src={AUTH_IMG} alt="login" className="h-[400px] w-[470px]" />
      </div>
    </div>
  );
};

export default Login;
