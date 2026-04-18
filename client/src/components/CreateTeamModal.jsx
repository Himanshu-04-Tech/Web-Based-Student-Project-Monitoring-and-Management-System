import { useState } from "react";
import API from "../api/axios";

export default function CreateTeamModal({ isOpen, onClose, onSuccess }) {
  const [form, setForm] = useState({
  year: "SY",
  branch: "CS",
  division: "A",
  groupNumber: "01",
  purpose: "COURSE_PROJECT",
});

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
      alert("Team Created ");
      onSuccess();
      onClose();
    } catch (err) {
      console.error("ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Error creating team");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-[400px] shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Create Team</h2>
          <button onClick={onClose}>✖</button>
        </div>

        {/* YEAR */}
        <select
          name="year"
          value={form.year}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        >
          <option value="">Select Year</option>
          <option value="SY">SY</option>
          <option value="TY">TY</option>
          <option value="BTech">BTech</option>
        </select>

        {/* BRANCH */}
        <select
          name="branch"
          value={form.branch}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        >
          <option value="">Select Branch</option>
          <option value="CS">CS</option>
          <option value="AIML">AIML</option>
          <option value="IT">IT</option>
        </select>

        {/* DIVISION */}
        <select
          name="division"
          value={form.division}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        >
          <option value="">Select Division</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="E">E</option>
        </select>

        {/* GROUP NUMBER */}
        <select
          name="groupNumber"
          value={form.groupNumber}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        >
          <option value="">Select Group Number</option>
          {[...Array(20)].map((_, i) => (
            <option key={i} value={String(i + 1).padStart(2, "0")}>
              {String(i + 1).padStart(2, "0")}
            </option>
          ))}
        </select>

        {/* PURPOSE */}
        <select
          name="purpose"
          value={form.purpose}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
        >
          <option value="">Select Purpose</option>
          <option value="COURSE_PROJECT">Course Project</option>
          <option value="EDI">EDI</option>
        </select>

        <button
          onClick={handleSubmit}
          className="w-full bg-black text-white py-2 rounded"
        >
          Create Team
        </button>
      </div>
    </div>
  );
}
