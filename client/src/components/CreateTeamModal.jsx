import { useState } from "react";
import API from "../api/axios";
import styles from "./CreateTeamModal.module.css";

export default function CreateTeamModal({ isOpen, onClose, onSuccess }) {
  const [form, setForm] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { year, branch, division, groupNumber, purpose } = form;
    if (!year || !branch || !division || !groupNumber || !purpose) {
      alert("Please fill all fields ⚠️");
      return;
    }
    try {
      await API.post("/group/create", form);
      alert("Team Created");
      onSuccess();
      onClose();
    } catch (err) {
      console.error("ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Error creating team");
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Create Team</h2>
          <button onClick={onClose} className={styles.closeBtn}>✕</button>
        </div>

        <label className={styles.fieldLabel}>Year</label>
        <select name="year" value={form.year || ""} onChange={handleChange} className={styles.select}>
          <option value="">Select Year</option>
          <option value="SY">SY</option>
          <option value="TY">TY</option>
          <option value="BTech">BTech</option>
        </select>

        <label className={styles.fieldLabel}>Branch</label>
        <select name="branch" value={form.branch || ""} onChange={handleChange} className={styles.select}>
          <option value="">Select Branch</option>
          <option value="CS">CS</option>
          <option value="AIML">AIML</option>
          <option value="IT">IT</option>
        </select>

        <label className={styles.fieldLabel}>Division</label>
        <select name="division" value={form.division || ""} onChange={handleChange} className={styles.select}>
          <option value="">Select Division</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="E">E</option>
        </select>

        <label className={styles.fieldLabel}>Group Number</label>
        <select name="groupNumber" value={form.groupNumber || ""} onChange={handleChange} className={styles.select}>
          <option value="">Select Group Number</option>
          {[...Array(20)].map((_, i) => (
            <option key={i} value={String(i + 1).padStart(2, "0")}>
              {String(i + 1).padStart(2, "0")}
            </option>
          ))}
        </select>

        <label className={styles.fieldLabel}>Purpose</label>
        <select name="purpose" value={form.purpose || ""} onChange={handleChange} className={styles.select}>
          <option value="">Select Purpose</option>
          <option value="COURSE_PROJECT">Course Project</option>
          <option value="EDI">EDI</option>
        </select>

        <button onClick={handleSubmit} className={styles.submitBtn}>
          Create Team
        </button>
      </div>
    </div>
  );
}