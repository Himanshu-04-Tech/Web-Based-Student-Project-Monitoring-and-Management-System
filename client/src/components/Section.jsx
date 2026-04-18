// components/Section.jsx
export default function Section({ title, children }) {
  return (
    <div className="bg-white shadow rounded-2xl p-5 mt-5">
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      {children}
    </div>
  );
}