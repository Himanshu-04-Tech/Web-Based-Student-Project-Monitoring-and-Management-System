const express = require("express");
const router = express.Router();
const { verifyToken, allowRoles } = require("../middleware/middlewareAuth");



const {
  createStudent,
  getStudents,
  joinGroupByCode,
  assignStudentToGroup,
  getStudentGroups,
  getStudentTasks,
} = require("../controllers/studentController");

// router.post("/", createStudent);
// router.get("/", getStudents);
// router.post("/join-group", joinGroupByCode);
// router.get("/groups", getStudentGroups);
// router.get("/tasks", getStudentTasks);
// router.post("/assign", assignStudentToGroup);

router.post("/join-group", verifyToken, allowRoles("STUDENT"), joinGroupByCode);
router.get("/groups", verifyToken, allowRoles("STUDENT"), getStudentGroups);
router.get("/tasks", verifyToken, allowRoles("STUDENT"), getStudentTasks);

module.exports = router;