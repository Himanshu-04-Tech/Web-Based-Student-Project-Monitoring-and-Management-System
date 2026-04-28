import StudentNavbar from "./studentNavbar";

const StudentLayout = ({ children }) => {
  return (
    <div >
      <StudentNavbar />
      <div>{children}</div>
    </div>
  );
};

export default StudentLayout;