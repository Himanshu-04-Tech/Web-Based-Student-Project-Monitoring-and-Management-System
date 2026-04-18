const express = require("express");
const router = express.Router();

const { getFacultyDashboard } = require("../controllers/facultyController");
const { verifyToken, allowRoles } = require("../middleware/middlewareAuth");

router.get(
  "/dashboard",
  verifyToken,
  allowRoles("FACULTY"),
  getFacultyDashboard
);

module.exports = router;