const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// CREATE GROUP
exports.createGroup = async (req, res) => {
  try {
    let { year, branch, division, groupNumber, purpose } = req.body;

    if (req.user.role !== "FACULTY") {
      return res.status(403).json({ message: "Only faculty can create groups" });
    }
    if (!year || !branch || !division || !groupNumber || !purpose) {
      return res.status(400).json({ message: "All fields required" });
    }

    let joinCode;
    let exists = true;
    while (exists) {
      joinCode = generateJoinCode();
      const existing = await prisma.group.findUnique({ where: { joinCode } });
      if (!existing) exists = false;
    }

    const name = `${year}-${branch}-${division}-${groupNumber}`;

    const existingGroup = await prisma.group.findFirst({
      where: { year, branch, division, groupNumber, purpose },
    });

    if (existingGroup) {
      return res.status(400).json({ message: "Group already exists ⚠️" });
    }

    const group = await prisma.group.create({
      data: {
        name,
        year,
        branch,
        division,
        groupNumber,
        purpose,
        joinCode,
        facultyId: req.user.userId,
      },
    });

    res.status(201).json({ message: "Group created successfully", data: group });

  } catch (error) {
    console.error(error);
    if (error.code === "P2003") {
      return res.status(400).json({ message: "Invalid facultyId" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE GROUP
exports.deleteGroup = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    // Delete all related records before deleting the group (no cascade on schema)
    await prisma.task.deleteMany({ where: { groupId: id } });
    await prisma.studentGroup.deleteMany({ where: { groupId: id } });
    await prisma.project.deleteMany({ where: { groupId: id } });

    await prisma.group.delete({ where: { id } });

    res.json({ message: "Group deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting group" });
  }
};

// GET ALL GROUPS (for faculty — their own groups)
exports.getGroups = async (req, res) => {
  try {
    const groups = await prisma.group.findMany({
      where: { facultyId: req.user.userId },
      include: {
        students: {           // ✅ include member count
          include: { user: true }
        },
        tasks: true
      }
    });
    res.json(groups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching groups" });
  }
};

// GET GROUP BY ID (faculty view — full details)
exports.getGroupById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const group = await prisma.group.findFirst({
      where: {
        id,
        facultyId: req.user.userId,   // ✅ only faculty's own group
      },
      include: {
        project: true,
        students: {                   // ✅ was "users" — now via StudentGroup
          include: { user: true }
        },
        tasks: true,
      },
    });

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // ✅ Flatten so frontend gets a simple members array like before
    const response = {
      ...group,
      members: group.students.map(sg => sg.user)  // expose user objects directly
    };

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching group details" });
  }
};

// GET MY GROUP (student view)
exports.getMyGroup = async (req, res) => {
  try {
    const userId = req.user.userId;

    // ✅ Find group via StudentGroup join table
    const membership = await prisma.studentGroup.findFirst({
      where: { userId },
      include: {
        group: {
          include: {
            project: true,
            tasks: true,
          }
        }
      }
    });

    if (!membership) {
      return res.status(404).json({ message: "User is not part of any group" });
    }

    res.json(membership.group);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching group" });
  }
};

// HELPER
function generateJoinCode(length = 7) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}