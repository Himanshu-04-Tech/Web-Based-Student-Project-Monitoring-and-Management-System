import { useEffect, useState } from "react";
import API from "../../api/axios";
import StudentLayout from "../../components/student/studentLayout";

const StudentTeams = () => {
  const [groups, setGroups] = useState([]);
  const [code, setCode] = useState("");

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await API.get("/students/groups");
      setGroups(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const joinGroup = async () => {
    try {
      await API.post("/students/join-group", { joinCode: code });
      setCode("");
      fetchGroups();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <StudentLayout>
      <h2 className="text-2xl font-bold mb-4">Teams</h2>

      {/* Join Section */}
      <div className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Enter join code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="border p-2 rounded w-64"
        />
        <button
          onClick={joinGroup}
          className="bg-blue-500 text-white px-4 rounded"
        >
          Join
        </button>
      </div>

      {/* Groups */}
      <div className="grid grid-cols-3 gap-4">
        {groups.map((g) => (
          <div key={g.id} className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold">{g.group.name}</h3>
            <p className="text-sm text-gray-500">
              Faculty: {g.group.faculty?.name}
            </p>
            <p className="text-sm">
              Members: {g.group.students.length}
            </p>
          </div>
        ))}
      </div>
    </StudentLayout>
  );
};

export default StudentTeams;