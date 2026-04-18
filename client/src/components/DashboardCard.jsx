// components/DashboardCard.jsx
export default function DashboardCard({ title, value, subtitle }) {
  return (
    <div className="bg-white shadow rounded-2xl p-5 w-full">
      <h3 className="text-gray-600 text-sm">{title}</h3>
      <h1 className="text-3xl font-bold mt-2">{value}</h1>
      <p className="text-gray-400 text-sm mt-1">{subtitle}</p>
    </div>
  );
}