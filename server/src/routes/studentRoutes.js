const express = require("express");
const router = express.Router();
const { verifyToken, allowRoles } = require("../middleware/middlewareAuth");

const {
  joinGroupByCode,
  getStudentGroups,
  getStudentTasks,
  getStudentGroupById,   // ✅ added
  upsertProject,         // ✅ added
} = require("../controllers/studentController");

router.post("/join-group",      verifyToken, allowRoles("STUDENT"), joinGroupByCode);
router.get("/groups",           verifyToken, allowRoles("STUDENT"), getStudentGroups);
router.get("/tasks",            verifyToken, allowRoles("STUDENT"), getStudentTasks);
router.get("/group/:id",        verifyToken, allowRoles("STUDENT"), getStudentGroupById);  // ✅ fixed
router.post("/group/:id/project", verifyToken, allowRoles("STUDENT"), upsertProject);      // ✅ fixed

module.exports = router;