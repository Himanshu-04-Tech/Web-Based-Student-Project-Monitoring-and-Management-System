const express = require("express");
const router = express.Router();

const {
  createGroup,
  getGroups,
  joinGroup,
  getMyGroup,
} = require("../controllers/groupController");

const {verifyToken , allowRoles } = require("../middleware/middlewareAuth");

// Get all groups
router.get("/", verifyToken, allowRoles("faculty") , getGroups);

// Create group (faculty)
router.post("/", verifyToken,allowRoles("student") , createGroup);

// Join group (student)
router.post("/join", verifyToken , joinGroup);

router.get("/my", verifyToken, getMyGroup);
// console.log("createGroup:", typeof createGroup);
// console.log("getGroups:", typeof getGroups);
// console.log("joinGroup:", typeof joinGroup);
// console.log("authMiddleware:", typeof authMiddleware);

module.exports = router;