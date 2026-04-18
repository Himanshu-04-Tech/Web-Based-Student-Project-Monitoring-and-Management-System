import { useEffect, useState } from "react";
import API from "../../api/axios";
import StudentLayout from "../../components/student/studentLayout";

const StudentDashboard = () => {
  const [groups, setGroups] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const g = await API.get("/students/groups");
      const t = await API.get("/students/tasks");

      setGroups(g.data);
      setTasks(t.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <StudentLayout>
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

      {/* Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <p>Total Groups</p>
          <h2 className="text-xl">{groups.length}</h2>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p>Pending Tasks</p>
          <h2 className="text-xl">{tasks.length}</h2>
        </div>
      </div>

      {/* Task List */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">Pending Tasks</h3>

        {tasks.map((task) => (
          <div key={task.id} className="border-b py-2">
            <p className="font-medium">{task.title}</p>
            <p className="text-sm text-gray-500">
              Group: {task.group.name}
            </p>
          </div>
        ))}
      </div>
    </StudentLayout>
  );
};

export default StudentDashboard;