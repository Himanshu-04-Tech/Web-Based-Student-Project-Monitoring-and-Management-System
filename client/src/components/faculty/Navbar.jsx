import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/faculty/FacultyDashboard" },
    { name: "Teams", path: "/faculty/FacultyTeams" },
    { name: "Tasks", path: "/faculty/FacultyTasks" },
  ];

  return (
    <div className="h-16 bg-white shadow flex items-center justify-between px-6">
      
      {/* LEFT: Logo */}
      <div className="flex items-center gap-8">
        <h1 className="text-xl font-bold text-blue-600">
          Projexis
        </h1>

        {/* NAV LINKS */}
        <div className="flex gap-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`font-medium ${
                location.pathname === item.path
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

        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          <span className="font-medium">Faculty</span>
        </div>

      </div>
    </div>
  );
}