import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function MainLayout() {
  return (
    <div className="min-h-screen w-full">
      <Navbar />
      <div className="p-6">
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;
