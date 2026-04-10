const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);


app.get("/", (req, res) => {
  res.send("Backend is running");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



//temporarily
const { verifyToken, allowRoles } = require("./middleware/middlewareAuth");
app.get(
  "/api/faculty/dashboard",
  verifyToken,
  allowRoles("FACULTY"),
  (req, res) => {
    res.json({ message: "Welcome Faculty Dashboard" });
  }
);

app.get(
  "/api/student/dashboard",
  verifyToken,
  allowRoles("STUDENT"),
  (req, res) => {
    res.json({ message: "Welcome Student Dashboard" });
  }
);

const divisionRoutes = require("./routes/divisionRoutes");
app.use("/api/divisions", divisionRoutes);

const batchRoutes = require("./routes/batchRoutes");
app.use("/api/batches", batchRoutes);

// console.log("divisionRoutes:", typeof divisionRoutes);
// console.log("batchRoutes:", typeof batchRoutes);

const studentRoutes = require("./routes/studentRoutes");
app.use("/api/students", studentRoutes);

const groupRoutes = require("./routes/groupRoutes");
app.use("/api/group", groupRoutes);


const projectRoutes = require("./routes/projectRoutes");
app.use("/api/projects", projectRoutes);

const attendanceRoutes = require("./routes/attendanceRoutes");
app.use("/api/attendance", attendanceRoutes);