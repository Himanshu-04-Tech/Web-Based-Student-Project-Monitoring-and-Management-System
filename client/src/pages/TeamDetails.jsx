import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";

export default function TeamDetails() {
  const { id } = useParams();
  const [team, setTeam] = useState(null);

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const res = await API.get(`/group/${id}`);
      setTeam(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!team) return <div className="p-6">Loading...</div>;

  if (!team.name) { 
    return <div className="p-6 text-red-500">Error loading team</div>;
  }
  console.log(team);
  return (
    <div className="p-6 space-y-6">
      {/* TEAM HEADER */}
      <div className="bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold">{team.name}</h1>
        <p className="text-gray-500">Join Code: {team.joinCode}</p>
        <p className="text-sm mt-2">
          {team.year} • {team.branch} • {team.division} • Group{" "}
          {team.groupNumber}
        </p>
      </div>

      {/* PROJECT */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">📌 Project</h2>

        {team.project ? (
          <>
            <p className="font-bold">{team.project.title}</p>
            <p className="text-gray-600">{team.project.description}</p>
          </>
        ) : (
          <p className="text-gray-400">No project assigned</p>
        )}
      </div>

      {/* MEMBERS */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">👥 Members</h2>

        {team.users?.length > 0 ? (
          team.users.map((m) => (
            <div key={m.id} className="border-b py-2">
              <p>{m.name}</p>
              <p className="text-sm text-gray-500">{m.email}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No members joined</p>
        )}
      </div>

      {/* TASKS */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">📝 Tasks</h2>

        {team.tasks?.length > 0 ? (
          team.tasks.map((t) => (
            <div key={t.id} className="border-b py-2">
              <p className="font-medium">{t.title}</p>
              <p className="text-sm text-gray-500">
                Deadline: {new Date(t.deadline).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No tasks assigned</p>
        )}
      </div>
    </div>
  );
}
