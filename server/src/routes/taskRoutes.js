const express = require("express");
const router = express.Router();

const {
  createTask,
  getTasksByGroup,
  toggleTaskStatus,
  updateDeadline,
  deleteTask,
} = require("../controllers/taskController");

const { verifyToken, allowRoles } = require("../middleware/middlewareAuth");

router.post("/", verifyToken, allowRoles("FACULTY"), createTask);
router.get("/:groupId", verifyToken, getTasksByGroup);
router.patch("/:id/toggle", verifyToken, toggleTaskStatus);
router.patch("/:id/deadline", verifyToken, updateDeadline);
router.delete("/:id", verifyToken, deleteTask);

module.exports = router;