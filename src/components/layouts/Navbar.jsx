import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import SideMenu from "./SideMenu";

import LOGO from "/logo.png";
import { useState } from "react";

const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);
  return (
    <div className="flex gap-5 bg-white border border-gray-200/50 backdrop-blur-[2px] py-4 px-7 sticky top-0 z-30">
      <button
        className="block lg:hidden text-black -mt-1"
        onClick={() => {
          setOpenSideMenu(!openSideMenu);
        }}
      >
        {openSideMenu ? (
          <HiOutlineX className="text-2xl" />
        ) : (
          <HiOutlineMenu className="text-2xl" />
        )}
      </button>

      <div className="flex items-center justify-center gap-4">
        <img src={LOGO} alt="logo" className="h-[24px] md:h-[36px]" />
        <span className="font-poppins font-extrabold text-[24px] md:text-4xl uppercase tracking-wider inline-block bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-600 bg-clip-text text-transparent drop-shadow-[0_4px_10px_rgba(0,0,0,0.25)] transform -skew-y-2">
          UAACAI
        </span>
      </div>
      

      {openSideMenu && (
        <div className="fixed top-[61px] -ml-4 bg-white">
          <SideMenu activeMenu={activeMenu} setOpenSideMenu={setOpenSideMenu} />
        </div>
      )}
    </div>
  );
};

export default Navbar;
