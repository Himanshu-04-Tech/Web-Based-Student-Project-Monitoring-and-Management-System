const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.markAttendance = async (req, res) => {
  try {
    const { userId, status } = req.body;
    const facultyId = req.user.userId;

    // only faculty allowed
    if (req.user.role !== "FACULTY") {
      return res.status(403).json({
        message: "Only faculty can mark attendance",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
      include: { group: true },
    });

    if (!user || !user.group) {
      return res.status(400).json({
        message: "User not in group",
      });
    }

    const attendance = await prisma.attendance.create({
      data: {
        userId: user.id,
        groupId: user.group.id,
        status,
      },
    });

    res.json(attendance);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error marking attendance" });
  }
};
exports.getMyAttendance = async (req, res) => {
  const userId = req.user.userId;

  const records = await prisma.attendance.findMany({
    where: { userId },
  });

  res.json(records);
};