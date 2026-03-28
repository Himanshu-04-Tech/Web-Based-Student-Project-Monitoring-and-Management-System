import { useState } from "react";
import API from "../api/axios";

function JoinGroup() {
  const [joinCode, setJoinCode] = useState("");

  const handleJoin = async () => {
    try {
      const token = localStorage.getItem("token");

      await API.post(
        "/groups/join",
        { joinCode },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Joined Group Successfully");
    } catch (err) {
      console.error(err);
       console.log(err.response?.data || err.message);
      alert("Failed to join group");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-xl mb-4">Join Group</h2>

        <input
          type="text"
          placeholder="Enter Join Code"
          className="w-full mb-4 p-2 border rounded"
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value)}
        />

        <button
          onClick={handleJoin}
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Join
        </button>
      </div>
    </div>
  );
}

export default JoinGroup;