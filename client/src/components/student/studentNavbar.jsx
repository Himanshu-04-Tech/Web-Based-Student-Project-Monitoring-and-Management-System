import { Link } from "react-router-dom";

const StudentNavbar = () => {
  return (
    <div className="bg-white shadow px-6 py-4 flex justify-between">
      <h1 className="text-xl font-bold">Student Panel</h1>

      <div className="space-x-6">
        <Link to="/student/dashboard">Dashboard</Link>
        <Link to="/student/teams">Teams</Link>
      </div>
    </div>
  );
};

export default StudentNavbar;