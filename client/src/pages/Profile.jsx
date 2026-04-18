import { useEffect, useState } from "react";
import API from "../api/axios";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleChangePassword = async () => {
    try {
      await API.put("/auth/change-password", {
        oldPassword,
        newPassword,
      });

      alert("Password updated successfully");
      setShowPasswordModal(false);
    } catch (err) {
      alert("Wrong old password");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // get logged-in user
        const userRes = await API.get("/auth/me");
        setUser(userRes.data);

        // if faculty → fetch dashboard
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

  if (!user) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex justify-center">
      <div className="bg-white rounded-2xl shadow p-8 w-full max-w-xl">
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center text-xl font-bold">
            {user.name[0]}
          </div>

          <div>
            <h1 className="text-xl font-bold">{user.name}</h1>
            <p className="text-gray-500">{user.role}</p>
          </div>
        </div>

        {/* EMAIL */}
        <div className="mb-4">
          <p className="text-sm text-gray-500">Email</p>
          <p className="font-medium">{user.email}</p>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col gap-3 mt-6">
          <button
            onClick={() => setShowEmailModal(true)}
            className="bg-gray-200 hover:bg-gray-300 p-3 rounded-lg text-left"
          >
            Change Email
          </button>

          <button
            onClick={() => setShowPasswordModal(true)}
            className="bg-gray-200 hover:bg-gray-300 p-3 rounded-lg text-left"
          >
            Change Password
          </button>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/";
            }}
            className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>
      {showPasswordModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center"
          //   onClick={() => setShowPasswordModal(false)}
        >
          <div className="bg-white p-6 rounded-xl w-96">
            <h2 className="text-lg font-bold mb-4">Change Password</h2>

            <input
              type="password"
              placeholder="Old Password"
              className="w-full border p-2 mb-3 rounded"
              onChange={(e) => setOldPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="New Password"
              className="w-full border p-2 mb-3 rounded"
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <button onClick={() => setShowPasswordModal(false)}>
                Cancel
              </button>

              <button
                onClick={handleChangePassword}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
      {showEmailModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center"
          onClick={() => setShowEmailModal(false)}
        >
          <div
            className="bg-white p-6 rounded-xl w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-4">Change Email</h2>

            <input
              type="email"
              placeholder="New Email"
              className="w-full border p-2 mb-3 rounded"
              onChange={(e) => setNewEmail(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <button onClick={() => setShowEmailModal(false)}>Cancel</button>

              <button
                onClick={handleChangeEmail}
                className="bg-blue-500 text-white px-4 py-2 rounded"
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
