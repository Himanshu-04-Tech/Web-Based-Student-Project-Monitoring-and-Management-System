import { useEffect, useState } from "react";
import API from "../../api/axios";
import CreateTeamModal from "../../components/CreateTeamModal";
import { useNavigate } from "react-router-dom";
import styles from "./FacultyTeams.module.css";

export default function FacultyTeams() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchGroups(); }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const res = await API.get("/group");
      setGroups(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteGroup = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this team? This cannot be undone.")) return;
    try {
      await API.delete(`/group/${id}`);
      fetchGroups();
    } catch (err) {
      console.error(err);
      alert("Error deleting team");
    }
  };

  const courseGroups = groups.filter(g => g.purpose === "COURSE_PROJECT");
  const ediGroups    = groups.filter(g => g.purpose === "EDI");

  const TeamCard = ({ g }) => {
    const members  = g.students?.map(sg => sg.user) || [];
    const tasks    = g.tasks || [];
    const done     = tasks.filter(t => t.completed).length;
    const pct      = tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0;
    const SHOW_MAX = 3;
    const visible  = members.slice(0, SHOW_MAX);
    const extra    = members.length - SHOW_MAX;

    return (
      <div className={styles.teamCard}>
        {/* TOP ROW */}
        <div className={styles.cardTop}>
          <h3 className={styles.teamName}>{g.name}</h3>
        </div>

        {/* PROGRESS */}
        <div className={styles.progressSection}>
          <div className={styles.progressLabelRow}>
            <span className={styles.progressLabel}>Progress</span>
            <span className={styles.progressPct}>{pct}%</span>
          </div>
          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* MEMBERS */}
        <div className={styles.membersSection}>
          <div className={styles.membersHeader}>
            <span className={styles.membersIcon}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </span>
            <span className={styles.membersCount}>{members.length} Members</span>
          </div>
          <div className={styles.membersList}>
            {visible.map(m => (
              <div key={m.id} className={styles.memberItem}>
                <span className={styles.memberDot} />
                <span className={styles.memberName}>{m.name}</span>
              </div>
            ))}
            {extra > 0 && <p className={styles.extraMembers}>+{extra} more</p>}
            {members.length === 0 && <p className={styles.noMembers}>No members yet</p>}
          </div>
        </div>

        {/* JOIN CODE */}
        <div className={styles.joinCodeRow}>
          <span className={styles.joinCodeLabel}>Code:</span>
          <span className={styles.joinCodeVal}>{g.joinCode}</span>
        </div>

        {/* ACTIONS */}
        <div className={styles.cardActions}>
          <button
            className={styles.viewBtn}
            onClick={() => navigate(`/faculty/team/${g.id}`)}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M2 12s3.636-7 10-7 10 7 10 7-3.636 7-10 7-10-7-10-7z"/>
            </svg>
            View Details
          </button>
          <button
            className={styles.deleteBtn}
            onClick={(e) => deleteGroup(g.id, e)}
            title="Delete team"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14H6L5 6"/>
              <path d="M10 11v6M14 11v6"/>
              <path d="M9 6V4h6v2"/>
            </svg>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.page}>
      {/* HEADER */}
      <div className={styles.header}>
        <div>
          <p className={styles.headerEyebrow}>Faculty Portal</p>
          <h1 className={styles.title}>Teams</h1>
          <p className={styles.subtitle}>Manage student project teams</p>
        </div>
        <button onClick={() => setOpenModal(true)} className={styles.createBtn}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Create Team
        </button>
      </div>

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.loadingSpinner} />
          Loading teams…
        </div>
      ) : (
        <>
          <div className={styles.sectionBlock}>
            <p className={styles.sectionHeading}>Course Projects</p>
            <div className={styles.grid}>
              {courseGroups.length > 0
                ? courseGroups.map(g => <TeamCard key={g.id} g={g} />)
                : <span className={styles.empty}>No course project teams yet.</span>}
            </div>
          </div>

          <div className={styles.sectionBlock}>
            <p className={styles.sectionHeading}>EDI</p>
            <div className={styles.grid}>
              {ediGroups.length > 0
                ? ediGroups.map(g => <TeamCard key={g.id} g={g} />)
                : <span className={styles.empty}>No EDI teams yet.</span>}
            </div>
          </div>
        </>
      )}

      <CreateTeamModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={fetchGroups}
      />
    </div>
  );
}