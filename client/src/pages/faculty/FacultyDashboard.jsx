// pages/FacultyDashboard.jsx
import DashboardCard from "../../components/DashboardCard";
import Section from "../../components/Section";
import TeamRow from "../../components/TeamRow";
import API from "../../api/axios";

import { useEffect, useState } from "react";
// import axios from "axios";

export default function FacultyDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get("/faculty/dashboard"); // ✅ FIX
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDashboard();
  }, []);

  if (!data) return <div>Loading...</div>;
  // const progress = `${data.completedTasks}/${data.totalTasks}`;
  const progress = `${data.completedTasks || 0}/${data.totalTasks || 0}`;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* 🔹 TOP CARDS */}
      <div className="grid grid-cols-4 gap-4">
        <DashboardCard
          title="Active Teams"
          value={data.totalTeams}
          subtitle="Total teams"
        />

        <DashboardCard
          title="Task Progress"
          value={progress}
          subtitle="Completed"
        />

        <DashboardCard
          title="Pending Tasks"
          value={data.pendingTasks}
          subtitle="Not completed"
        />

        <DashboardCard
          title="Completed Tasks"
          value={data.completedTasks}
          subtitle="Finished"
        />
      </div>

      {/* 🔹 TEAM OVERVIEW */}
      <Section title="Team Overview">
        {data.teams?.map((team, i) => (
          <TeamRow key={i} team={team} />
        ))}
      </Section>

      {/* 🔹 UPCOMING DEADLINES */}
      <Section title="Upcoming Deadlines">
        {data.deadlines?.map((d, i) => (
          <p key={i} className="text-sm py-1">
            • {d.teamName} — {d.title} — {new Date(d.date).toLocaleDateString()}
          </p>
        ))}
      </Section>

      {/* 🔹 ALERTS */}
      <Section title="Alerts">
        {data.alerts?.map((a, i) => (
          <p key={i} className="text-red-500 text-sm py-1">
            ⚠️ {a}
          </p>
        ))}
      </Section>

      {/* 🔹 RECENT ACTIVITY */}
      <Section title="Recent Activity">
        {data.activity?.map((a, i) => (
          <p key={i} className="text-sm py-1">
            • {a}
          </p>
        ))}
      </Section>
    </div>
  );
}
