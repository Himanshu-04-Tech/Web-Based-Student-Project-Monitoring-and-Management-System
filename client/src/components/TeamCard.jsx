import { useNavigate } from "react-router-dom";

const TeamCard = ({ team }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/teams/${team.id}`);
  };

  const getTypeLabel = (type) => {
    return type === "COURSE_PROJECT" ? "Course Project" : "EDI";
  };

  return (
    <div className="team-card" onClick={handleClick}>

      {/* HEADER */}
      <div className="card-header">
        <h3>{team.name}</h3>
        <span className="badge">
          {getTypeLabel(team.purpose)}
        </span>
      </div>

      {/* BODY */}
      <div className="card-body">
        <p><strong>Division:</strong> {team.batch?.name}</p>
      </div>

    </div>
  );
};

export default TeamCard;