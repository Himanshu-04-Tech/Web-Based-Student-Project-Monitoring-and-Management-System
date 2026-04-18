// components/TeamRow.jsx
import ProgressBar from "./ProgressBar";

export default function TeamRow({ team }) {
  return (
    <div className="flex justify-between items-center p-3 border-b">
      <div>
        <h4 className="font-semibold">{team.name}</h4>
        <p className="text-sm text-gray-500">
          {team.members} members
        </p>
      </div>

      <div className="w-1/3">
        <ProgressBar percentage={team.progress} />
      </div>

      <div className="text-sm">
        {team.progress}%
      </div>
    </div>
  );
}