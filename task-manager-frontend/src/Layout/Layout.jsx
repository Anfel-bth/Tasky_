import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
function Layout() {
  return (
    <div className="flex h-screen">
      <div className="w-[252px] h-full shrink-0">
        <Sidebar />
      </div>
      <main className="flex-1 overflow-y-auto bg-white">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
