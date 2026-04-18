import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import deleteIcon from "../assets/delete.png";

export default function TeamDetails() {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");

  useEffect(() => {
    fetchTeam();
  }, [id]);

  const fetchTeam = async () => {
    try {
      const res = await API.get(`/group/${id}`);

      if (!res.data) {
        setTeam("NOT_FOUND");
      } else {
        setTeam(res.data);
      }
    } catch (err) {
      console.error(err);
      setTeam("ERROR");
    }
  };
  const handleAddTask = () => {
    setShowModal(true);
  };

  const toggleTask = async (taskId) => {
    await API.patch(`/task/${taskId}/toggle`);
    fetchTeam();
  };

  const updateDeadline = async (taskId, newDate) => {
    await API.patch(`/task/${taskId}/deadline`, {
      deadline: newDate,
    });
    fetchTeam();
  };
  const submitTask = async () => {
    if (!title || !deadline) {
      alert("All fields required");
      return;
    }

    try {
      await API.post("/task", {
        title,
        deadline,
        groupId: Number(id),
      });

      setShowModal(false);
      setTitle("");
      setDeadline("");
      fetchTeam();
    } catch (err) {
      console.error(err);
    }
  };
  const deleteTask = async (taskId) => {
    const confirmDelete = window.confirm("Delete this task?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/task/${taskId}`);
      fetchTeam();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this team?",
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/group/${id}`);
      alert("Team deleted successfully");

      navigate("/faculty/FacultyTeams"); // redirect after delete
    } catch (err) {
      console.error(err);
      alert("Error deleting team");
    }
  };

  if (team === "ERROR")
    return <div className="p-6 text-red-500">Error loading team</div>;

  if (team === "NOT_FOUND")
    return (
      <div className="p-6 text-red-500">Unauthorized or Team not found</div>
    );

  if (!team) return <div className="p-6">Loading...</div>;
  // console.log(team);
  return (
    <div className="p-6 space-y-6">
      <button
        onClick={() => navigate("/faculty/FacultyTeams")}
        className="mb-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-sm"
      >
        ← Back
      </button>
      {/* TEAM HEADER */}
      <div className="bg-white p-6 rounded shadow">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{team.name}</h1>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold bg-black text-white px-3 py-1 rounded-full">
              {team.purpose}
            </span>

            <button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
            >
              Delete
            </button>
          </div>
        </div>
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
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">📝 Tasks</h2>

          <button
            onClick={handleAddTask}
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
          >
            + Add Task
          </button>
        </div>

        {/* ✅ ADD MODAL HERE */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow w-96 space-y-4">
              <h2 className="text-lg font-semibold">Add Task</h2>

              <input
                type="text"
                placeholder="Enter task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border p-2 rounded"
              />

              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full border p-2 rounded"
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1 bg-gray-300 rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={submitTask}
                  className="px-3 py-1 bg-blue-500 text-white rounded"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        {team.tasks?.length > 0 ? (
          team.tasks.map((t) => (
            <div key={t.id} className="border-b py-2">
              <div className="flex justify-between items-center">
                <div>
                  <p
                    className={`font-medium ${t.completed ? "line-through text-gray-400" : ""}`}
                  >
                    {t.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    Deadline: {new Date(t.deadline).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex gap-2 items-center">
                  <button
                    onClick={() => toggleTask(t.id)}
                    className="text-sm bg-green-500 text-white px-2 py-1 rounded"
                  >
                    {t.completed ? "Undo" : "Done"}
                  </button>

                  <input
                    type="date"
                    onChange={(e) => updateDeadline(t.id, e.target.value)}
                    className="text-sm border px-2 py-1"
                  />
                  <button
                    onClick={() => deleteTask(t.id)}
                    className="p-1 bg-red-500 hover:bg-red-100 rounded"
                  >
                    <img src={deleteIcon} alt="delete" className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No tasks assigned</p>
        )}
      </div>
    </div>
  );
}
