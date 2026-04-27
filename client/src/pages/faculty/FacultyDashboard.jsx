// pages/FacultyDashboard.jsx
import styles from "./FacultyDashboard.module.css";
import { useEffect, useState } from "react";
import API from "../../api/axios";

// ── Mini Donut Chart ────────────────────────────────────────────
function DonutChart({ completed, total }) {
  const pct = total > 0 ? completed / total : 0;
  const r = 28;
  const circ = 2 * Math.PI * r;
  const dash = pct * circ;
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" className={styles.donut}>
      <circle cx="36" cy="36" r={r} className={styles.donutTrack} />
      <circle
        cx="36" cy="36" r={r}
        className={styles.donutFill}
        strokeDasharray={`${dash} ${circ}`}
        strokeDashoffset={circ / 4}
        style={{ transition: "stroke-dasharray 0.6s cubic-bezier(.4,0,.2,1)" }}
      />
      <text x="36" y="39" textAnchor="middle" className={styles.donutLabel}>
        {Math.round(pct * 100)}%
      </text>
    </svg>
  );
}

function daysUntil(dateStr) {
  const diff = new Date(dateStr) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function FacultyDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get("/faculty/dashboard");
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDashboard();
  }, []);

  if (!data) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.loadingSpinner} />
        <span>Loading dashboard</span>
      </div>
    );
  }

  const total = data.totalTasks || 0;
  const completed = data.completedTasks || 0;
  const pending = data.pendingTasks || 0;

  return (
    <div className={styles.page}>

      {/* ── HEADER ─────────────────────────────────────────── */}
      <header className={styles.header}>
        <div>
          <p className={styles.headerEyebrow}>Faculty Portal</p>
          <h1 className={styles.headerTitle}>Dashboard</h1>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.dateBadge}>
            <span className={styles.dateDot} />
            {new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "long" })}
          </div>
        </div>
      </header>

      {/* ── STAT GRID ──────────────────────────────────────── */}
      <section className={styles.statsGrid}>

        {/* Teams */}
        <div className={`${styles.statCard} ${styles.statCardTeams}`}>
          <span className={styles.statEyebrow}>Active Teams</span>
          <span className={styles.statNum}>{data.totalTeams ?? 0}</span>
          <span className={styles.statSub}>enrolled groups</span>
          <div className={styles.statDecor}>
            {Array.from({ length: Math.min(data.totalTeams ?? 4, 8) }).map((_, i) => (
              <span key={i} className={styles.teamDot} style={{ animationDelay: `${i * 0.12}s` }} />
            ))}
          </div>
        </div>

        {/* Task Progress */}
        <div className={`${styles.statCard} ${styles.statCardProgress}`}>
          <div className={styles.progressInner}>
            <div>
              <span className={styles.statEyebrow}>Task Progress</span>
              <span className={styles.statNum}>{completed}<span className={styles.statNumMuted}>/{total}</span></span>
              <span className={styles.statSub}>tasks completed</span>
            </div>
            <DonutChart completed={completed} total={total} />
          </div>
        </div>

        {/* Pending */}
        <div className={`${styles.statCard} ${styles.statCardPending}`}>
          <span className={styles.statEyebrow}>Pending</span>
          <span className={styles.statNum}>{pending}</span>
          <span className={styles.statSub}>awaiting completion</span>
          {pending > 0 && <div className={styles.pendingPulse} />}
        </div>

        {/* Completed */}
        <div className={`${styles.statCard} ${styles.statCardDone}`}>
          <span className={styles.statEyebrow}>Completed</span>
          <span className={styles.statNum}>{completed}</span>
          <span className={styles.statSub}>tasks finished</span>
          <div className={styles.checkmark}>✓</div>
        </div>

      </section>

      {/* ── MAIN CONTENT GRID ──────────────────────────────── */}
      <div className={styles.mainGrid}>

        {/* LEFT COL */}
        <div className={styles.leftCol}>
          <section className={styles.panel}>
            <div className={styles.panelHeader}>
              <span className={styles.panelDot} />
              <p className={styles.panelTitle}>Team Overview</p>
              <span className={styles.panelCount}>{data.teams?.length ?? 0} teams</span>
            </div>
            <div className={styles.teamList}>
              {data.teams?.map((team, i) => {
                const pct = team.totalTasks > 0
                  ? Math.round((team.completedTasks / team.totalTasks) * 100)
                  : 0;
                const tier = pct === 100 ? "done" : pct < 30 ? "low" : "mid";
                return (
                  <div key={i} className={styles.teamRow}>
                    <div className={styles.teamAvatar} data-tier={tier}>
                      {team.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className={styles.teamBody}>
                      <div className={styles.teamMeta}>
                        <span className={styles.teamName}>{team.name}</span>
                        <span className={styles.teamMembers}>
                          {team.memberCount ?? team.members ?? 0} members
                        </span>
                      </div>
                      <div className={styles.barWrap}>
                        <div className={styles.barTrack}>
                          <div
                            className={styles.barFill}
                            data-tier={tier}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className={styles.barPct}>{pct}%</span>
                      </div>
                      <div className={styles.teamTaskLine}>
                        {team.completedTasks ?? 0}/{team.totalTasks ?? 0} tasks
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* RIGHT COL */}
        <div className={styles.rightCol}>

          {/* Upcoming Deadlines */}
          <section className={styles.panel}>
            <div className={styles.panelHeader}>
              <span className={styles.panelDot} style={{ background: "#f59e0b" }} />
              <p className={styles.panelTitle}>Upcoming Deadlines</p>
            </div>
            <div className={styles.deadlineList}>
              {data.deadlines?.length ? data.deadlines.map((d, i) => {
                const days = daysUntil(d.date);
                const urgency = days <= 2 ? "urgent" : days <= 5 ? "soon" : "ok";
                return (
                  <div key={i} className={`${styles.deadlineItem} ${styles["deadline_" + urgency]}`}>
                    <div className={styles.deadlineDays} data-urgency={urgency}>
                      {days <= 0 ? "Today" : `${days}d`}
                    </div>
                    <div className={styles.deadlineBody}>
                      <p className={styles.deadlineTitle}>{d.title}</p>
                      <p className={styles.deadlineTeam}>{d.teamName} · {new Date(d.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                    </div>
                    {urgency === "urgent" && <span className={styles.urgentBadge}>!</span>}
                  </div>
                );
              }) : (
                <p className={styles.emptyMsg}>No upcoming deadlines</p>
              )}
            </div>
          </section>

          {/* Alerts */}
          <section className={styles.panel}>
            <div className={styles.panelHeader}>
              <span className={styles.panelDot} style={{ background: "#ef4444" }} />
              <p className={styles.panelTitle}>Alerts</p>
              {data.alerts?.length > 0 && (
                <span className={styles.alertBadge}>{data.alerts.length}</span>
              )}
            </div>
            <div className={styles.alertList}>
              {data.alerts?.length ? data.alerts.map((a, i) => (
                <div key={i} className={styles.alertItem}>
                  <div className={styles.alertIconBox}>▲</div>
                  <p className={styles.alertText}>{a}</p>
                </div>
              )) : (
                <p className={styles.emptyMsg}>No active alerts</p>
              )}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}