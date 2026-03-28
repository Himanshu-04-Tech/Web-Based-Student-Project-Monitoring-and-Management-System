const express = require("express");
const router = express.Router();

const {
  createStudent,
  getStudents,
  joinGroupByCode,
  assignStudentToGroup
} = require("../controllers/studentController");

router.post("/", createStudent);
router.get("/", getStudents);
router.post("/join-group", joinGroupByCode);

module.exports = router;