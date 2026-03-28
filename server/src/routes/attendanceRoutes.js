const express = require("express");
const router = express.Router();

const { markAttendance } = require("../controllers/attendanceController");
const { verifyToken } = require("../middleware/middlewareAuth");

router.post("/", verifyToken, markAttendance);

module.exports = router;