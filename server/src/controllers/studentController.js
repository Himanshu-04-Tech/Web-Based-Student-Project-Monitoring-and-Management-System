const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createStudent = async (req, res) => {
  try {
    const { name, email, batchId } = req.body;

    if (!name || !email || !batchId) {
      return res.status(400).json({
        message: "All fields required",
      });
    }

    const student = await prisma.student.create({
      data: {
        name,
        email,
        batchId: Number(batchId),
      },
    });

    return res.status(201).json({
      message: "Student created",
      data: student,
    });

  } catch (error) {
    console.error(error);

    if (error.code === "P2002") {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    if (error.code === "P2003") {
      return res.status(400).json({
        message: "Invalid batchId",
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
exports.getStudents = async (req, res) => {
  try {
    const students = await prisma.student.findMany({
      include: {
        batch: {
          include: {
            division: true,
          },
        },
      },
    });

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Error fetching students" });
  }
};
exports.joinGroupByCode = async (req, res) => {
  try {
    const { studentId, joinCode } = req.body;

    if (!studentId || !joinCode) {
      return res.status(400).json({
        message: "studentId and joinCode required",
      });
    }

    const group = await prisma.group.findUnique({
      where: { joinCode },
    });

    if (!group) {
      return res.status(404).json({
        message: "Invalid join code",
      });
    }

    const student = await prisma.student.update({
      where: { id: Number(studentId) },
      data: {
        groupId: group.id,
      },
    });

    res.json({
      message: "Joined group successfully",
      data: student,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.assignStudentToGroup = async (req, res) => {
  try {
    const { studentId, groupId } = req.body;

    if (!studentId || !groupId) {
      return res.status(400).json({
        message: "studentId and groupId required",
      });
    }

    const student = await prisma.student.update({
      where: { id: Number(studentId) },
      data: {
        groupId: Number(groupId),
      },
    });

    res.json({
      message: "Student assigned manually",
      data: student,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};