import { BrowserRouter, Routes, Route } from "react-router-dom";

// Auth
import Login from "./pages/Login";
import Register from "./pages/Register";

// Faculty
import FacultyLayout from "./components/faculty/FacultyLayout";
import FacultyDashboard from "./pages/faculty/FacultyDashboard";
import FacultyTeams from "./pages/faculty/FacultyTeams";
import TeamDetails from "./pages/TeamDetails.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* FACULTY */}
        <Route path="/faculty" element={<FacultyLayout />}>
          <Route index element={<FacultyDashboard />} />
          <Route path="FacultyDashboard" element={<FacultyDashboard />} />
          <Route path="FacultyTeams" element={<FacultyTeams />} />  

        </Route>
          <Route path="/team/:id" element={<TeamDetails />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;