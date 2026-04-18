const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const authMiddleware = require("../middleware/middlewareAuth");
exports.joinGroupByCode = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { joinCode } = req.body;

    if (!studentId || !joinCode) {
      return res.status(400).json({
        message: "studentId and joinCode required",
      });
    }

    // 1. Find group
    const group = await prisma.group.findUnique({
      where: { joinCode },
    });

    if (!group) {
      return res.status(404).json({
        message: "Invalid join code",
      });
    }

    // 2. Check already joined
    const existing = await prisma.studentGroup.findUnique({
      where: {
        studentId_groupId: {
          studentId: Number(studentId),
          groupId: group.id,
        },
      },
    });

    if (existing) {
      return res.status(400).json({
        message: "Already joined this group",
      });
    }

    // 3. Create relation
    const join = await prisma.studentGroup.create({
      data: {
        studentId: Number(studentId),
        groupId: group.id,
      },
    });

    res.json({
      message: "Joined group successfully",
      data: join,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.getStudentGroups = async (req, res) => {
  const studentId = req.user.id;
  console.log("USER:", req.user);

  const groups = await prisma.studentGroup.findMany({
    where: { studentId },
    include: {
      group: {
        include: {
          faculty: true,
          students: true
        }
      }
    }
  });

  res.json(groups);
};
exports.getStudentTasks = async (req, res) => {
  const studentId = req.user.id;

  const studentGroups = await prisma.studentGroup.findMany({
    where: { studentId },
    select: { groupId: true }
  });

  const groupIds = studentGroups.map(g => g.groupId);

  const tasks = await prisma.task.findMany({
    where: {
      groupId: { in: groupIds },
      status: "pending"
    },
    include: { group: true }
  });

  res.json(tasks);
};