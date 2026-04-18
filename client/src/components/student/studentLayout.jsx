import StudentNavbar from "./studentNavbar";

const StudentLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <StudentNavbar />
      <div className="p-6">{children}</div>
    </div>
  );
};

export default StudentLayout;