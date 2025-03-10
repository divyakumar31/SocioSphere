import { NavigationBar } from "@/components";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex w-full">
      <NavigationBar />
      <div className="w-full py-14 h-screen overflow-scroll scrollbar-none xsm:py-0">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
