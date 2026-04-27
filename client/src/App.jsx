import { BrowserRouter, Routes, Route } from "react-router-dom";

// Auth
import Login from "./pages/Login";
import Register from "./pages/Register";

// Faculty
import FacultyLayout from "./components/faculty/FacultyLayout";
import FacultyDashboard from "./pages/faculty/FacultyDashboard";
import FacultyTeams from "./pages/faculty/FacultyTeams";
import TeamDetails from "./pages/TeamDetails.jsx";
import Profile from "./pages/Profile";

//student
import StudentDashboard from "./pages/student/studentDashboard";
import StudentTeams from "./pages/student/studentTeams";
import StudentTeamDetails from "./pages/student/StudentTeamDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/profile" element={<Profile />} />

        {/* FACULTY */}
        <Route path="/faculty" element={<FacultyLayout />}>
          <Route index element={<FacultyDashboard />} />
          <Route path="FacultyDashboard" element={<FacultyDashboard />} />
          <Route path="FacultyTeams" element={<FacultyTeams />} />

          <Route path="team/:id" element={<TeamDetails />} />
        </Route>

        
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/teams" element={<StudentTeams />} />
          <Route path="/student/team/:id" element={<StudentTeamDetails />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;