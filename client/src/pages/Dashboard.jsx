import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard 🚀</h1>

      <div className="flex gap-4">
        <button
          onClick={() => navigate("/join-group")}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Join Group
        </button>

        <button
          onClick={() => navigate("/create-project")}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Create Project
        </button>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
        <button
          onClick={() => navigate("/create-project")}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Create Project
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
