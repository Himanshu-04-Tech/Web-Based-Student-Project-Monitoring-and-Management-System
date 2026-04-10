import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function FacultyLayout() {
  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="p-4">
        <Outlet />
      </div>
    </div>
  );
}