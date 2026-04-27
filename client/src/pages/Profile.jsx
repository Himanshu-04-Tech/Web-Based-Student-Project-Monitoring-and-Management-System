import { useEffect, useState } from "react";
import API from "../api/axios";
import styles from "./Profile.module.css";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const handleChangePassword = async () => {
    try {
      await API.put("/auth/change-password", { oldPassword, newPassword });
      alert("Password updated successfully");
      setShowPasswordModal(false);
    } catch (err) {
      alert("Wrong old password");
    }
  };

  const handleChangeEmail = async () => {
    try {
      await API.put("/auth/change-email", { newEmail });
      alert("Email updated successfully");
      setShowEmailModal(false);
    } catch (err) {
      alert("Error updating email");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await API.get("/auth/me");
        setUser(userRes.data);
        if (userRes.data.role === "FACULTY") {
          const dashRes = await API.get("/faculty/dashboard");
          setDashboard(dashRes.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  if (!user) return <div className={styles.loading}>Loading…</div>;

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={styles.page}>
      <div className={styles.card}>

        {/* HEADER */}
        <div className={styles.header}>
          <div className={styles.avatar}>{initials}</div>
          <div className={styles.headerText}>
            <h1>{user.name}</h1>
            <span className={styles.roleBadge}>{user.role}</span>
          </div>
        </div>

        {/* INFO FIELDS */}
        <div className={styles.field}>
          <p className={styles.fieldLabel}>Email</p>
          <p className={styles.fieldValue}>{user.email}</p>
        </div>

        {user.branch && (
          <div className={styles.field}>
            <p className={styles.fieldLabel}>Branch</p>
            <p className={styles.fieldValue}>{user.branch}</p>
          </div>
        )}

        <div className={styles.divider} />

        {/* ACTIONS */}
        <p className={styles.actionsLabel}>Account Settings</p>
        <div className={styles.actions}>
          <button
            onClick={() => setShowEmailModal(true)}
            className={styles.actionBtn}
          >
            <span className={styles.actionIcon}>✉</span>
            Change Email
            <span className={styles.actionArrow}>›</span>
          </button>

          <button
            onClick={() => setShowPasswordModal(true)}
            className={styles.actionBtn}
          >
            <span className={styles.actionIcon}>🔒</span>
            Change Password
            <span className={styles.actionArrow}>›</span>
          </button>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/";
            }}
            className={styles.logoutBtn}
          >
            <span className={styles.actionIcon}>↩</span>
            Logout
          </button>
        </div>
      </div>

      {/* CHANGE PASSWORD MODAL */}
      {showPasswordModal && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Change Password</h2>
              <button
                onClick={() => setShowPasswordModal(false)}
                className={styles.closeBtn}
              >
                ✕
              </button>
            </div>

            <label className={styles.inputLabel}>Current Password</label>
            <input
              type="password"
              placeholder="Enter old password"
              className={styles.input}
              onChange={(e) => setOldPassword(e.target.value)}
            />

            <label className={styles.inputLabel}>New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              className={styles.input}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <div className={styles.modalFooter}>
              <button
                onClick={() => setShowPasswordModal(false)}
                className={styles.cancelBtn}
              >
                Cancel
              </button>
              <button
                onClick={handleChangePassword}
                className={styles.confirmBtn}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CHANGE EMAIL MODAL */}
      {showEmailModal && (
        <div
          className={styles.overlay}
          onClick={() => setShowEmailModal(false)}
        >
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Change Email</h2>
              <button
                onClick={() => setShowEmailModal(false)}
                className={styles.closeBtn}
              >
                ✕
              </button>
            </div>

            <label className={styles.inputLabel}>New Email Address</label>
            <input
              type="email"
              placeholder="Enter new email"
              className={styles.input}
              onChange={(e) => setNewEmail(e.target.value)}
            />

            <div className={styles.modalFooter}>
              <button
                onClick={() => setShowEmailModal(false)}
                className={styles.cancelBtn}
              >
                Cancel
              </button>
              <button
                onClick={handleChangeEmail}
                className={styles.confirmBtn}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

