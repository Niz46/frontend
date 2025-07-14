// src/components/Layout/DashboardLayout.jsx
import { useSelector } from "react-redux";
import SideMenu from "./SideMenu";
import Navbar from "./Navbar";

export const DashboardLayout = ({ children, activeMenu }) => {
  // Pull `user` from Redux instead of context
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="">
      <Navbar activeMenu={activeMenu} />

      {user && (
        <div className="flex">
          <div className="max-[1080px]:hidden">
            {/* Since DashboardLayout never toggled SideMenu in the old version,
                we keep the same API: pass a no-op setter. */}
            <SideMenu activeMenu={activeMenu} setOpenSideMenu={() => {}} />
          </div>
          <div className="grow mx-5">{children}</div>
        </div>
      )}
    </div>
  );
};
