// src/components/Navbar/BlogNavbar.jsx
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { LuSearch } from "react-icons/lu";
import { Link } from "react-router-dom";

import { BLOG_NAVBAR_DATA } from "../../../utils/data";
import Logo from "/logo.svg";

import SideMenu from "../SideMenu";
import ProfileInfoCard from "../../Cards/ProfileInfoCard";
import Login from "../../Auth/Login";
import SignUp from "../../Auth/SignUp";
import Modal from "../../Modal";

import {
  setOpenAuthForm as setOpenAuthFormAction,
} from "../../../store/slices/authSlice";

const BlogNavbar = ({ activeMenu }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [openSideMenu, setOpenSideMenu] = useState(false);
  const [openSearchBar, setOpenSearchBar] = useState(false);

  return (
    <>
      <div className="bg-white border border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-7 sticky top-0 z-30">
        <div className="container mx-auto flex items-center justify-between gap-5">
          <div className="flex gap-5">
            <button
              className="block lg:hidden text-black -mt-1"
              onClick={() => setOpenSideMenu((prev) => !prev)}
            >
              {openSideMenu ? (
                <HiOutlineX className="text-2xl" />
              ) : (
                <HiOutlineMenu className="text-2xl" />
              )}
            </button>

            <Link to="/">
              <img src={Logo} alt="logo" className="h-[24px] md:h-[26px]" />
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-10">
            {BLOG_NAVBAR_DATA.map((item, index) => {
              if (item.onlySideMenu) return null;
              return (
                <Link key={item.id} to={item.path}>
                  <li className="text-[15px] text-black font-medium list-none relative group cursor-pointer">
                    {item.label}
                    <span
                      className={`absolute inset-x-0 bottom-0 h-[2px] bg-sky-500 transition-all duration-300 origin-left ${
                        index === 0 ? "scale-x-100" : "scale-x-0"
                      } group-hover:scale-x-100`}
                    />
                  </li>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-6">
            <button
              className="hover:text-sky-500 cursor-pointer"
              onClick={() => setOpenSearchBar(true)}
            >
              <LuSearch className="text-[22px]" />
            </button>

            {!user ? (
              <button
                className="flex items-center justify-center gap-3 bg-linear-to-r from-sky-500 to-cyan-400 text-xs md:text-sm font-semibold text-white px-5 md:px-7 py-2 rounded-full hover:bg-black hover:text-white transition-colors cursor-pointer hover:shadow-2xl hover:shadow-cyan-200"
                onClick={() => dispatch(setOpenAuthFormAction(true))}
              >
                Login/SignUp
              </button>
            ) : (
              <div className="hidden md:block">
                <ProfileInfoCard />
              </div>
            )}
          </div>

          {openSideMenu && (
            <div className="fixed top-[61px] -ml-4 bg-white">
              <SideMenu
                activeMenu={activeMenu}
                isBlogMenu
                setOpenSideMenu={setOpenSideMenu}
              />
            </div>
          )}
        </div>
      </div>

      <AuthModal />
    </>
  );
};

export default BlogNavbar;

// embedded in same file or split into its own file:
const AuthModal = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.auth.openAuthForm);
  const [currentPage, setCurrentPage] = useState("login");

  const handleClose = () => {
    dispatch(setOpenAuthFormAction(false));
    setCurrentPage("login");
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} hideHeader>
      <div>
        {currentPage === "login" && (
          <Login setCurrentPage={setCurrentPage} />
        )}
        {currentPage === "signup" && (
          <SignUp setCurrentPage={setCurrentPage} />
        )}
      </div>
    </Modal>
  );
};
