import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function FacultyLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="w-full px-6 py-4">
        <Outlet />
      </div>
    </div>
  );
}