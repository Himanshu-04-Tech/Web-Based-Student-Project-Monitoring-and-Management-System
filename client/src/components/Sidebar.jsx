import {
  FaTh,
  FaUsers,
  FaTasks,
  FaCalendar,
  FaExclamationTriangle,
  FaFileAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  return (
    <div className="w-64 bg-white shadow-xl flex flex-col justify-between">
      {/* Top */}
      <div>
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold">Project Manager</h1>
          <p className="text-sm text-gray-500">Faculty Portal</p>
        </div>

        <nav className="p-4 space-y-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-3 p-3 w-full rounded-lg hover:bg-blue-100"
          >
            <FaTh /> Dashboard
          </button>

          <button
            onClick={() => navigate("/teams")}
            className="flex items-center gap-3 p-3 w-full rounded-lg hover:bg-gray-100"
          >
            <FaUsers /> Teams
          </button>

          <button className="flex items-center gap-3 p-3 w-full rounded-lg hover:bg-gray-100">
            <FaTasks /> Tasks
          </button>

          <button className="flex items-center gap-3 p-3 w-full rounded-lg hover:bg-gray-100">
            <FaCalendar /> Schedule
          </button>

          <button className="flex items-center gap-3 p-3 w-full rounded-lg hover:bg-gray-100">
            <FaExclamationTriangle /> Risks
          </button>

          <button className="flex items-center gap-3 p-3 w-full rounded-lg hover:bg-gray-100">
            <FaFileAlt /> Reports
          </button>
        </nav>
      </div>

      {/* Bottom */}
      <div className="p-4 border-t">
        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/");
          }}
          className="w-full flex items-center justify-center gap-2 p-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
