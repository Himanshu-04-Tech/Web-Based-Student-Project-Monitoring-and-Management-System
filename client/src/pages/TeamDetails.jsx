import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import deleteIcon from "../assets/delete.png";
import styles from "./TeamDetails.module.css";

export default function TeamDetails() {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");

  useEffect(() => { fetchTeam(); }, [id]);

  const fetchTeam = async () => {
    try {
      const res = await API.get(`/group/${id}`);
      setTeam(res.data ? res.data : "NOT_FOUND");
    } catch (err) {
      console.error(err);
      setTeam("ERROR");
    }
  };

  const toggleTask = async (taskId) => {
    await API.patch(`/task/${taskId}/toggle`);
    fetchTeam();
  };

  const updateDeadline = async (taskId, newDate) => {
    await API.patch(`/task/${taskId}/deadline`, { deadline: newDate });
    fetchTeam();
  };

  const submitTask = async () => {
    if (!title || !deadline) { alert("All fields required"); return; }
    try {
      await API.post("/task", { title, deadline, groupId: Number(id) });
      setShowModal(false);
      setTitle("");
      setDeadline("");
      fetchTeam();
    } catch (err) { console.error(err); }
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await API.delete(`/task/${taskId}`);
      fetchTeam();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this team?")) return;
    try {
      await API.delete(`/group/${id}`);
      alert("Team deleted successfully");
      navigate("/faculty/FacultyTeams");
    } catch (err) {
      console.error(err);
      alert("Error deleting team");
    }
  };

  if (team === "ERROR") return <div className={styles.statusError}>Error loading team.</div>;
  if (team === "NOT_FOUND") return <div className={styles.statusError}>Unauthorized or team not found.</div>;
  if (!team) return <div className={styles.statusLoading}>Loading…</div>;

  const getInitials = (name) => name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "?";

  return (
    <div className={styles.page}>
      <button onClick={() => navigate("/faculty/FacultyTeams")} className={styles.backBtn}>
        ← Back
      </button>

      {/* TEAM HEADER */}
      <div className={styles.card}>
        <div className={styles.teamHeaderTop}>
          <h1 className={styles.teamTitle}>{team.name}</h1>
          <div className={styles.headerActions}>
            <span className={styles.purposeBadge}>{team.purpose}</span>
            <button onClick={handleDelete} className={styles.deleteBtnRed}>Delete</button>
          </div>
        </div>
        <p className={styles.joinCode}>
          Join Code: <span className={styles.joinCodeVal}>{team.joinCode}</span>
        </p>
        <p className={styles.teamMeta}>
          {team.year} · {team.branch} · {team.division} · Group {team.groupNumber}
        </p>
      </div>

      {/* PROJECT */}
      <div className={styles.card}>
        <p className={styles.cardSectionTitle}>Project</p>
        {team.project ? (
          <>
            <p className={styles.projectTitle}>{team.project.title}</p>
            <p className={styles.projectDesc}>{team.project.description}</p>
          </>
        ) : (
          <p className={styles.noData}>No project assigned yet.</p>
        )}
      </div>

      {/* MEMBERS */}
      <div className={styles.card}>
        <p className={styles.cardSectionTitle}>Members</p>
        {team.members?.length > 0 ? (
          team.members.map((m) => (
            <div key={m.id} className={styles.memberRow}>
              <div className={styles.memberAvatar}>{getInitials(m.name)}</div>
              <div>
                <p className={styles.memberName}>{m.name}</p>
                <p className={styles.memberEmail}>{m.email}</p>
              </div>
            </div>
          ))
        ) : (
          <p className={styles.noData}>No members joined yet.</p>
        )}
      </div>

      {/* TASKS */}
      <div className={styles.card}>
        <div className={styles.taskHeader}>
          <p className={styles.taskHeaderTitle}>Tasks</p>
          <button onClick={() => setShowModal(true)} className={styles.addTaskBtn}>
            + Add Task
          </button>
        </div>

        {/* ADD TASK MODAL */}
        {showModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <h2 className={styles.modalTitle}>Add Task</h2>
              <input
                type="text"
                placeholder="Task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={styles.modalInput}
              />
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className={styles.modalInput}
              />
              <div className={styles.modalFooter}>
                <button onClick={() => setShowModal(false)} className={styles.cancelBtn}>Cancel</button>
                <button onClick={submitTask} className={styles.confirmBtn}>Add Task</button>
              </div>
            </div>
          </div>
        )}

        {team.tasks?.length > 0 ? (
          team.tasks.map((t) => (
            <div key={t.id} className={styles.taskRow}>
              <div>
                <p className={`${styles.taskTitle} ${t.completed ? styles.done : ""}`}>
                  {t.title}
                </p>
                <p className={styles.taskDeadline}>
                  Due: {new Date(t.deadline).toLocaleDateString()}
                </p>
              </div>
              <div className={styles.taskActions}>
                <button
                  onClick={() => toggleTask(t.id)}
                  className={`${styles.toggleBtn} ${t.completed ? styles.undo : styles.done}`}
                >
                  {t.completed ? "Undo" : "Done"}
                </button>
                <input
                  type="date"
                  onChange={(e) => updateDeadline(t.id, e.target.value)}
                  className={styles.dateInput}
                />
                <button onClick={() => deleteTask(t.id)} className={styles.taskDeleteBtn}>
                  <img src={deleteIcon} alt="delete" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className={styles.noData}>No tasks assigned yet.</p>
        )}
      </div>
    </div>
  );
}