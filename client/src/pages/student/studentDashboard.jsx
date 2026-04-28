import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import StudentLayout from "../../components/student/studentLayout";
import styles from "./StudentDashboard.module.css";

const StudentDashboard = () => {
  const [groups, setGroups] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [g, t] = await Promise.all([
        API.get("/students/groups"),
        API.get("/students/tasks")
      ]);
      setGroups(g.data);
      setTasks(t.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);
  const overdueTasks = pendingTasks.filter(t => new Date(t.deadline) < new Date());

  const getDeadlineLabel = (deadline) => {
    const d = new Date(deadline);
    const today = new Date();
    const diff = Math.ceil((d - today) / (1000 * 60 * 60 * 24));
    if (diff < 0) return { label: "Overdue", cls: styles.overdue };
    if (diff === 0) return { label: "Due today", cls: styles.dueToday };
    if (diff <= 3) return { label: `${diff}d left`, cls: styles.dueSoon };
    return { label: `${diff}d left`, cls: styles.dueOk };
  };

  const getInitials = (name) =>
    name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "?";

  if (loading) return (
    <StudentLayout>
      <div className={styles.loadingWrap}>
        <div className={styles.spinner} />
        <p>Loading dashboard…</p>
      </div>
    </StudentLayout>
  );

  return (
    <StudentLayout>
      <div className={styles.page}>
        {/* HEADER */}
        <div className={styles.header}>
          <p className={styles.eyebrow}>Student Portal</p>
          <h1 className={styles.title}>Dashboard</h1>
        </div>

        {/* STAT CARDS */}
        <div className={styles.statsGrid}>
          <div className={`${styles.statCard} ${styles.statBlue}`}>
            <p className={styles.statLabel}>Active Teams</p>
            <p className={styles.statValue}>{groups.length}</p>
          </div>
          <div className={`${styles.statCard} ${styles.statAmber}`}>
            <p className={styles.statLabel}>Pending Tasks</p>
            <p className={styles.statValue}>{pendingTasks.length}</p>
          </div>
          <div className={`${styles.statCard} ${styles.statRed}`}>
            <p className={styles.statLabel}>Overdue</p>
            <p className={styles.statValue}>{overdueTasks.length}</p>
          </div>
          <div className={`${styles.statCard} ${styles.statGreen}`}>
            <p className={styles.statLabel}>Completed</p>
            <p className={styles.statValue}>{completedTasks.length}</p>
          </div>
        </div>

        <div className={styles.twoCol}>
          {/* TEAMS */}
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <h2 className={styles.panelTitle}>Team Overview</h2>
              <button className={styles.panelLink} onClick={() => navigate("/student/teams")}>
                {groups.length} teams →
              </button>
            </div>
            {groups.length === 0 ? (
              <p className={styles.empty}>No teams joined yet.</p>
            ) : (
              <div className={styles.teamList}>
                {groups.map(g => {
                  const done = g.tasks?.filter(t => t.completed).length || 0;
                  const total = g.tasks?.length || 0;
                  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                  return (
                    <div
                      key={g.id}
                      className={styles.teamRow}
                      onClick={() => navigate(`/student/team/${g.id}`)}
                    >
                      <div className={styles.teamInfo}>
                        <div className={styles.teamAvatar}>{getInitials(g.name)}</div>
                        <div>
                          <p className={styles.teamName}>{g.name}</p>
                          <p className={styles.teamMeta}>{done}/{total} tasks</p>
                        </div>
                      </div>
                      <div className={styles.teamProgress}>
                        <div className={styles.miniBar}>
                          <div className={styles.miniBarFill} style={{ width: `${pct}%` }} />
                        </div>
                        <span className={styles.pct}>{pct}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* TASKS */}
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <h2 className={styles.panelTitle}>Upcoming Deadlines</h2>
              <span className={styles.taskCount}>{pendingTasks.length}</span>
            </div>
            {pendingTasks.length === 0 ? (
              <div className={styles.allDone}>
                <p>🎉 All tasks completed!</p>
              </div>
            ) : (
              <div className={styles.taskList}>
                {pendingTasks.map(task => {
                  const { label, cls } = getDeadlineLabel(task.deadline);
                  return (
                    <div key={task.id} className={styles.taskRow}>
                      <div className={styles.taskDot} />
                      <div className={styles.taskInfo}>
                        <p className={styles.taskTitle}>{task.title}</p>
                        <p className={styles.taskGroup}>{task.group?.name}</p>
                      </div>
                      <span className={`${styles.deadlineBadge} ${cls}`}>{label}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentDashboard;