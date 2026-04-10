import { useEffect, useState } from "react";
import API from "../../api/axios";
import CreateTeamModal from "../../components/CreateTeamModal";
import { useNavigate } from "react-router-dom";


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

  const courseGroups = groups.filter((g) => g.purpose === "COURSE_PROJECT");
  const ediGroups = groups.filter((g) => g.purpose === "EDI");

  const getName = (g) => `${g.year}-${g.branch}-${g.division}-${g.groupNumber}`;

  return (
  <div className="p-6">
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Teams</h1>
      <button
        onClick={() => setOpenModal(true)}
        className="bg-black text-white px-4 py-2 rounded"
      >
        + Create Team
      </button>
    </div>

    {/* COURSE */}
    <h2 className="text-xl font-semibold mb-4">Course Projects</h2>
    <div className="grid grid-cols-2 gap-4 mb-8">
      {courseGroups.map((g) => (
        <div key={g.id}   onClick={() => navigate(`/faculty/team/${g.id}`)} className="p-4 bg-white rounded shadow">
          <h3 className="font-bold">{getName(g)}</h3>
          <p className="text-sm text-gray-500">Join Code: {g.joinCode}</p>
        </div>
      ))}
    </div>

    {/* EDI */}
    <h2 className="text-xl font-semibold mb-4">EDI</h2>
    <div className="grid grid-cols-2 gap-4">
      {ediGroups.map((g) => (
        <div key={g.id}   onClick={() => navigate(`/faculty/team/${g.id}`)} className="p-4 bg-white rounded shadow">
          <h3 className="font-bold">{getName(g)}</h3>
          <p className="text-sm text-gray-500">Join Code: {g.joinCode}</p>
        </div>
      ))}
    </div>

    {/* ✅ FIX: MOVE MODAL HERE */}
    <CreateTeamModal
      isOpen={openModal}
      onClose={() => setOpenModal(false)}
      onSuccess={fetchGroups}
    />
  </div>
);
  
}
