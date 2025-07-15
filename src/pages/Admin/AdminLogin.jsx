import { useState } from "react";
import LOGO from "/logo.png";
import Login from "../../components/Auth/Login";
import SignUp from "../../components/Auth/SignUp";

const AdminLogin = () => {
  const [currentPage, setCurrentPage] = useState("login");

  return (
    <>
      <div className="bg-white py-5 border-b border-gray-50">
        <div className="container mx-auto">
          <div className="flex items-center justify-center gap-10">
            <img src={LOGO} alt="logo" className="h-[24px] md:h-[36px]" />
            <span className="font-poppins font-extrabold text-[24px] md:text-4xl uppercase tracking-wider inline-block bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-600 bg-clip-text text-transparent drop-shadow-[0_4px_10px_rgba(0,0,0,0.25)] transform -skew-y-2">
              UAACAI
            </span>
          </div>
        </div>
      </div>

      <div className="min-h-[calc(100vh-67px)] flex items-center justify-center">
        <div className="bg-white rounded-2xl overflow-hidden shadow-2xl shadow-gray-200/60">
          {currentPage === "login" ? (
            <Login setCurrentPage={setCurrentPage} />
          ) : (
            <SignUp setCurrentPage={setCurrentPage} showAdminToken={true} />
          )}
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
