const express = require("express");
const router = express.Router();


const {
  createGroup,
  getGroups,
  joinGroup,
  getMyGroup,
  getGroupById,
} = require("../controllers/groupController");

const { verifyToken, allowRoles } = require("../middleware/middlewareAuth");

// Get all groups
router.get("/", verifyToken, allowRoles("FACULTY"), getGroups);
// router.get("/:id", verifyToken, getGroupById);

router.get("/:id", verifyToken, getGroupById);
// Create group
router.post("/create", verifyToken, allowRoles("FACULTY"), createGroup);

// Join group
router.post("/join", verifyToken, allowRoles("STUDENT"), joinGroup);

// Get my group
router.get("/my", verifyToken, getMyGroup);

module.exports = router;