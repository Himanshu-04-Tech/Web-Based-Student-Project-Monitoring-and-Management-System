import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function MainLayout() {
  return (
    <div className="flex h-screen">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100">
        <Outlet />   {/* 🔥 THIS IS THE MOST IMPORTANT LINE */}
      </div>

    </div>
  );
}

export default MainLayout;