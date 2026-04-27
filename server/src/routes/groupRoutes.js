const express = require("express");
const router = express.Router();
const prisma = require("../prisma"); 

const {
  createGroup,
  getGroups,
  joinGroup,
  getMyGroup,
  getGroupById,
  deleteGroup,
} = require("../controllers/groupController");

const { verifyToken, allowRoles } = require("../middleware/middlewareAuth");

// Get all groups
router.get("/", verifyToken, allowRoles("FACULTY"), getGroups);
// router.get("/:id", verifyToken, getGroupById);

router.get("/:id",verifyToken, allowRoles("FACULTY"), getGroupById);
// router.get("/:id", async (req, res) => {
//   try {
//     const id = parseInt(req.params.id);

//     const group = await prisma.group.findUnique({
//       where: { id },
//       include: {
//         users: true,
//         project: true,
//         tasks: true,
//       },
//     });

//     if (!group) {
//       return res.status(404).json({ message: "Group not found" });
//     }

//     res.json(group);
//   } catch (error) {
//     console.error("ERROR:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });
// Create group
router.post("/create", verifyToken, allowRoles("FACULTY"), createGroup);

// Join group
// router.post("/join", verifyToken, allowRoles("STUDENT"), joinGroup); 

// Get my group
router.get("/my", verifyToken, getMyGroup);
router.delete("/:id", deleteGroup);

module.exports = router;