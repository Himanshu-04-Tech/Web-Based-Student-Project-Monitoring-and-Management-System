import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../api/axios";
// import Profile from "./pages/Profile";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: "Dashboard", path: "/faculty/FacultyDashboard" },
    { name: "Teams", path: "/faculty/FacultyTeams" },
    // { name: "Tasks", path: "/faculty/FacultyTasks" },
  ];
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/auth/me");
        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, []);
  return (
    <div className="h-16 bg-white shadow flex items-center justify-between px-6">
      {/* LEFT: Logo */}
      <div className="flex items-center gap-8">
        <h1 className="text-xl font-bold text-blue-600">Projexis</h1>

        {/* NAV LINKS */}
        <div className="flex gap-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`font-medium ${
                location.pathname.startsWith(item.path)
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      {/* RIGHT: Profile */}
      <div className="flex items-center gap-4">
        <button className="text-gray-600">🔔</button>

        <div
          onClick={() => navigate("/profile")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-gray-300"></div>
          <span>Faculty</span>
        </div>
      </div>
    </div>
  );
}
