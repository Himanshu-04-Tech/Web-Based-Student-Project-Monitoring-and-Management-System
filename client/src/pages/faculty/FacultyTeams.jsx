import { useEffect, useState } from "react";
import API from "../../api/axios";
import CreateTeamModal from "../../components/CreateTeamModal";
import { useNavigate } from "react-router-dom";
import deleteIcon from "../../assets/delete.png";

export default function FacultyTeams() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await API.get("/group");
      setGroups(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  const deleteGroup = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this team?",
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/group/${id}`);
      alert("Team deleted successfully");

      fetchGroups(); // 🔥 refresh list instead of navigate
    } catch (err) {
      console.error(err);
      alert("Error deleting team");
    }
  };

  const courseGroups = groups.filter((g) => g.purpose === "COURSE_PROJECT");
  const ediGroups = groups.filter((g) => g.purpose === "EDI");

  const getName = (g) => `${g.year}-${g.branch}-${g.division}-${g.groupNumber}`;

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Teams</h1>
          <p className="text-gray-500">Manage student project teams</p>
        </div>

        <button
          onClick={() => setOpenModal(true)}
          className="bg-black text-white px-5 py-2 rounded-lg"
        >
          + Create Team
        </button>
      </div>

      {/* ================= COURSE PROJECTS ================= */}
      <h2 className="text-xl font-semibold mb-4">Course Projects</h2>

      <div className="flex flex-wrap gap-6 mb-10">
        {courseGroups.map((g) => (
          <div
            key={g.id}
            className="bg-white p-4 rounded-2xl shadow border w-[320px]"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-md font-semibold">{getName(g)}</h3>

              {/* <span className="bg-black text-white text-xs px-3 py-1 rounded-full">
                active
              </span> */}
            </div>

            <p className="text-gray-500 text-sm mb-3">
              Join Code: {g.joinCode}
            </p>

            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={() => navigate(`/faculty/team/${g.id}`)}
                className="flex items-center gap-2 border px-3 py-1 rounded-full text-sm"
              >
                👁 View Details
              </button>

              <button
                onClick={() => deleteGroup(g.id)}
                className="p-1 bg-red-500 hover:bg-red-100 rounded"
              >
                <img src={deleteIcon} alt="delete" className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
      {/*deleteGroup(g.id)*/}

      {/* ================= EDI ================= */}
      <h2 className="text-xl font-semibold mb-4">EDI</h2>

      <div className="flex flex-wrap gap-6">
        {ediGroups.map((g) => (
          <div
            key={g.id}
            className="bg-white p-4 rounded-2xl shadow border w-[320px]"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-md font-semibold">{getName(g)}</h3>

              {/* <span className="bg-black text-white text-xs px-3 py-1 rounded-full">
                active
              </span> */}
            </div>

            <p className="text-gray-500 text-sm mb-3">
              Join Code: {g.joinCode}
            </p>

            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={() => navigate(`/faculty/team/${g.id}`)}
                className="flex items-center gap-2 border px-3 py-1 rounded-full text-sm"
              >
                👁 View Details
              </button>

              <button
                onClick={() => deleteGroup(g.id)}
                className="p-1 bg-red-500 hover:bg-red-100 rounded"
              >
                <img src={deleteIcon} alt="delete" className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      <CreateTeamModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={fetchGroups}
      />
    </div>
  );
}
