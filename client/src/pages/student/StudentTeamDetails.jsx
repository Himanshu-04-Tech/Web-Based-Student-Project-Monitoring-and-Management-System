import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import StudentLayout from "../../components/student/studentLayout";
import styles from "./StudentTeamDetails.module.css";

export default function StudentTeamDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [status, setStatus] = useState("loading");
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [projectForm, setProjectForm] = useState({ title: "", description: "" });
  const [savingProject, setSavingProject] = useState(false);

  useEffect(() => { fetchTeam(); }, [id]);

  const fetchTeam = async () => {
    try {
      setStatus("loading");
      const res = await API.get(`/students/group/${id}`);
      setTeam(res.data);
      if (res.data.project) {
        setProjectForm({
          title: res.data.project.title,
          description: res.data.project.description,
        });
      }
      setStatus("ok");
    } catch (err) {
      console.error(err);
      setStatus(err.response?.status === 403 ? "notfound" : "error");
    }
  };

  const saveProject = async () => {
    if (!projectForm.title || !projectForm.description) {
      return alert("Title and description are required");
    }
    try {
      setSavingProject(true);
      await API.post(`/students/group/${id}/project`, projectForm);
      await fetchTeam();
      setShowProjectModal(false);
      alert("Project saved!");
    } catch (err) {
      alert(err.response?.data?.message || "Error saving project");
    } finally {
      setSavingProject(false);
    }
  };

  const getInitials = (name) =>
    name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "?";

  const getDeadlineStatus = (deadline, completed) => {
    if (completed) return { label: "Done", cls: styles.done };
    const diff = Math.ceil((new Date(deadline) - new Date()) / 86400000);
    if (diff < 0) return { label: "Overdue", cls: styles.overdue };
    if (diff === 0) return { label: "Due today", cls: styles.dueToday };
    if (diff <= 3) return { label: `${diff}d left`, cls: styles.dueSoon };
    return { label: `${diff}d left`, cls: styles.dueOk };
  };

  if (status === "loading") return (
    <StudentLayout>
      <div className={styles.centerState}><div className={styles.spinner} /><p>Loading team…</p></div>
    </StudentLayout>
  );

  if (status === "error") return (
    <StudentLayout>
      <div className={styles.centerState}>
        <p className={styles.errorText}>Error loading team.</p>
        <button className={styles.backBtn} onClick={() => navigate("/student/teams")}>← Back to Teams</button>
      </div>
    </StudentLayout>
  );

  if (status === "notfound") return (
    <StudentLayout>
      <div className={styles.centerState}>
        <p className={styles.errorText}>You're not a member of this team.</p>
        <button className={styles.backBtn} onClick={() => navigate("/student/teams")}>← Back to Teams</button>
      </div>
    </StudentLayout>
  );

  const pendingTasks = team.tasks?.filter(t => !t.completed) || [];
  const completedTasksList = team.tasks?.filter(t => t.completed) || [];
  const totalTasks = team.tasks?.length || 0;
  const pct = totalTasks > 0 ? Math.round((completedTasksList.length / totalTasks) * 100) : 0;

  return (
    <StudentLayout>
      <div className={styles.page}>
        {/* BACK */}
        <button className={styles.backBtn} onClick={() => navigate("/student/teams")}>
          ← Back to Teams
        </button>

        {/* TEAM HEADER */}
        <div className={styles.heroCard}>
          <div className={styles.heroTop}>
            <div>
              <span className={styles.purposeTag}>
                {team.purpose === "COURSE_PROJECT" ? "Course Project" : "EDI"}
              </span>
              <h1 className={styles.teamName}>{team.name}</h1>
              <p className={styles.teamMeta}>
                {team.year} · {team.branch} · Division {team.division} · Group {team.groupNumber}
              </p>
            </div>
            <div className={styles.joinCodeBox}>
              <p className={styles.joinCodeLabel}>Join Code</p>
              <p className={styles.joinCodeVal}>{team.joinCode}</p>
            </div>
          </div>

          <div className={styles.progressSection}>
            <div className={styles.progressHeader}>
              <span>Task Progress</span>
              <span>{completedTasksList.length}/{totalTasks} completed · {pct}%</span>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>

        <div className={styles.twoCol}>
          {/* LEFT COLUMN */}
          <div className={styles.leftCol}>
            {/* PROJECT */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Project</h2>
                <button
                  className={styles.editBtn}
                  onClick={() => setShowProjectModal(true)}
                >
                  {team.project ? "✏️ Edit" : "+ Add Project"}
                </button>
              </div>

              {team.project ? (
                <div className={styles.projectInfo}>
                  <h3 className={styles.projectTitle}>{team.project.title}</h3>
                  <p className={styles.projectDesc}>{team.project.description}</p>
                  <p className={styles.projectDeadline}>
                    📅 Deadline: {new Date(team.project.deadline).toLocaleDateString("en-IN", {
                      day: "numeric", month: "long", year: "numeric"
                    })}
                  </p>
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <p>📋 No project added yet.</p>
                  <p className={styles.emptyHint}>Click "Add Project" to get started.</p>
                </div>
              )}
            </div>

            {/* MEMBERS */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Members</h2>
                <span className={styles.countBadge}>{team.members?.length || 0}</span>
              </div>
              <div className={styles.memberList}>
                {team.faculty && (
                  <div className={`${styles.memberRow} ${styles.facultyRow}`}>
                    <div className={`${styles.avatar} ${styles.facultyAvatar}`}>
                      {getInitials(team.faculty.name)}
                    </div>
                    <div>
                      <p className={styles.memberName}>{team.faculty.name}</p>
                      <p className={styles.memberRole}>Faculty</p>
                    </div>
                  </div>
                )}
                {team.members?.length > 0 ? (
                  team.members.map(m => (
                    <div key={m.id} className={styles.memberRow}>
                      <div className={styles.avatar}>{getInitials(m.name)}</div>
                      <div>
                        <p className={styles.memberName}>{m.name}</p>
                        <p className={styles.memberRole}>{m.email}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className={styles.emptySmall}>No members yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN — TASKS */}
          <div className={styles.rightCol}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Tasks</h2>
                <div className={styles.taskStats}>
                  <span className={styles.statPill} style={{ background: "rgba(37,99,235,0.1)", color: "#60a5fa" }}>
                    {pendingTasks.length} pending
                  </span>
                  <span className={styles.statPill} style={{ background: "rgba(34,197,94,0.1)", color: "#4ade80" }}>
                    {completedTasksList.length} done
                  </span>
                </div>
              </div>

              <p className={styles.readOnlyNote}>
                ℹ️ Tasks are assigned by your faculty. Mark them complete when done.
              </p>

              {totalTasks === 0 ? (
                <div className={styles.emptyState}>
                  <p>📌 No tasks assigned yet.</p>
                  <p className={styles.emptyHint}>Your faculty will assign tasks soon.</p>
                </div>
              ) : (
                <div className={styles.taskList}>
                  {pendingTasks.length > 0 && (
                    <>
                      <p className={styles.taskGroupLabel}>Pending</p>
                      {pendingTasks.map(t => {
                        const { label, cls } = getDeadlineStatus(t.deadline, t.completed);
                        return (
                          <div key={t.id} className={styles.taskRow}>
                            <div className={styles.taskLeft}>
                              <div className={`${styles.taskCheck} ${styles.unchecked}`} />
                              <div>
                                <p className={styles.taskTitle}>{t.title}</p>
                                <p className={styles.taskDeadline}>
                                  Due {new Date(t.deadline).toLocaleDateString("en-IN", {
                                    day: "numeric", month: "short"
                                  })}
                                </p>
                              </div>
                            </div>
                            <span className={`${styles.deadlineBadge} ${cls}`}>{label}</span>
                          </div>
                        );
                      })}
                    </>
                  )}

                  {completedTasksList.length > 0 && (
                    <>
                      <p className={styles.taskGroupLabel}>Completed</p>
                      {completedTasksList.map(t => (
                        <div key={t.id} className={`${styles.taskRow} ${styles.completedRow}`}>
                          <div className={styles.taskLeft}>
                            <div className={`${styles.taskCheck} ${styles.checked}`}>✓</div>
                            <div>
                              <p className={`${styles.taskTitle} ${styles.strikethrough}`}>{t.title}</p>
                              <p className={styles.taskDeadline}>
                                Due {new Date(t.deadline).toLocaleDateString("en-IN", {
                                  day: "numeric", month: "short"
                                })}
                              </p>
                            </div>
                          </div>
                          <span className={`${styles.deadlineBadge} ${styles.done}`}>Done</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* PROJECT MODAL */}
      {showProjectModal && (
        <div className={styles.modalOverlay} onClick={() => setShowProjectModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>
              {team.project ? "Edit Project" : "Add Project"}
            </h2>
            <p className={styles.modalHint}>This info is visible to your faculty.</p>

            <label className={styles.fieldLabel}>Project Title</label>
            <input
              className={styles.fieldInput}
              placeholder="e.g. Smart Attendance System"
              value={projectForm.title}
              onChange={e => setProjectForm(p => ({ ...p, title: e.target.value }))}
            />

            <label className={styles.fieldLabel}>Description</label>
            <textarea
              className={styles.fieldTextarea}
              placeholder="Brief description of your project…"
              rows={4}
              value={projectForm.description}
              onChange={e => setProjectForm(p => ({ ...p, description: e.target.value }))}
            />

            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => setShowProjectModal(false)}>
                Cancel
              </button>
              <button className={styles.saveBtn} onClick={saveProject} disabled={savingProject}>
                {savingProject ? "Saving…" : "Save Project"}
              </button>
            </div>
          </div>
        </div>
      )}
    </StudentLayout>
  );
}