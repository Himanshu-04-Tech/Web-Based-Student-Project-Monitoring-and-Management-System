import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import StudentLayout from "../../components/student/studentLayout";
import styles from "./StudentTeams.module.css";

const StudentTeams = () => {
  const [groups, setGroups] = useState([]);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { fetchGroups(); }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const res = await API.get("/students/groups");
      setGroups(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const joinGroup = async () => {
    if (!code.trim()) return alert("Please enter a join code");
    try {
      setJoining(true);
      await API.post("/students/join-group", { joinCode: code });
      await fetchGroups();
      alert("Joined successfully!");
      setCode("");
    } catch (err) {
      alert(err.response?.data?.message || "Error joining group");
    } finally {
      setJoining(false);
    }
  };

  const courseGroups = groups.filter(g => g.purpose === "COURSE_PROJECT");
  const ediGroups = groups.filter(g => g.purpose === "EDI");

  const GroupCard = ({ g }) => {
    const completedTasks = g.tasks?.filter(t => t.completed).length || 0;
    const totalTasks = g.tasks?.length || 0;
    const pct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return (
      <div className={styles.card} onClick={() => navigate(`/student/team/${g.id}`)}>
        <div className={styles.cardTop}>
          <span className={styles.purposeTag}>{g.purpose === "COURSE_PROJECT" ? "Course" : "EDI"}</span>
        </div>
        <h3 className={styles.cardName}>{g.name}</h3>
        <p className={styles.cardFaculty}>👤 {g.faculty?.name || "Not Assigned"}</p>
        <p className={styles.cardMembers}>👥 {g.students?.length || 0} members</p>

        <div className={styles.progressSection}>
          <div className={styles.progressHeader}>
            <span>Tasks</span>
            <span>{completedTasks}/{totalTasks}</span>
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${pct}%` }} />
          </div>
        </div>

        <button className={styles.viewBtn}>View Details →</button>
      </div>
    );
  };

  return (
    <StudentLayout>
      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>My Teams</h1>
            <p className={styles.subtitle}>Join and manage your project groups</p>
          </div>
        </div>

        {/* JOIN SECTION */}
        <div className={styles.joinBox}>
          <p className={styles.joinTitle}>Join a Team</p>
          <div className={styles.joinRow}>
            <input
              type="text"
              placeholder="Enter join code (e.g. aB3xY7z)"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && joinGroup()}
              className={styles.joinInput}
            />
            <button onClick={joinGroup} disabled={joining} className={styles.joinBtn}>
              {joining ? "Joining…" : "Join"}
            </button>
          </div>
        </div>

        {loading ? (
          <div className={styles.loading}>Loading your teams…</div>
        ) : groups.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyIcon}>🎓</p>
            <p className={styles.emptyText}>You haven't joined any teams yet.</p>
            <p className={styles.emptyHint}>Use a join code from your faculty to get started.</p>
          </div>
        ) : (
          <>
            {courseGroups.length > 0 && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Course Projects</h2>
                <div className={styles.grid}>
                  {courseGroups.map(g => <GroupCard key={g.id} g={g} />)}
                </div>
              </section>
            )}
            {ediGroups.length > 0 && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>EDI</h2>
                <div className={styles.grid}>
                  {ediGroups.map(g => <GroupCard key={g.id} g={g} />)}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </StudentLayout>
  );
};

export default StudentTeams;