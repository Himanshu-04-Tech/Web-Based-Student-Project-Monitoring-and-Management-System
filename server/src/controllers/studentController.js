const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.joinGroupByCode = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { joinCode } = req.body;

    if (!userId || !joinCode) {
      return res.status(400).json({ message: "studentId and joinCode required" });
    }

    const group = await prisma.group.findUnique({ where: { joinCode } });

    if (!group) {
      return res.status(404).json({ message: "Invalid join code" });
    }

    const alreadyJoined = await prisma.studentGroup.findUnique({
      where: { userId_groupId: { userId, groupId: group.id } }
    });

    if (alreadyJoined) {
      return res.status(400).json({ message: "Already in this group" });
    }

    await prisma.studentGroup.create({
      data: { userId, groupId: group.id }
    });

    res.json({ message: "Joined group successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getStudentGroups = async (req, res) => {
  try {
    const userId = req.user.userId;

    const groups = await prisma.group.findMany({
      where: {
        students: { some: { userId } }
      },
      include: {
        faculty: { select: { id: true, name: true, email: true } },
        students: { include: { user: { select: { id: true, name: true, email: true } } } },
        tasks: true,
        project: true
      }
    });

    res.json(groups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getStudentTasks = async (req, res) => {
  try {
    const userId = req.user.userId;

    // ✅ Fixed: use StudentGroup join table instead of old "users" relation
    const tasks = await prisma.task.findMany({
      where: {
        group: {
          students: {
            some: { userId }   // ✅ was: users: { some: { id: userId } }
          }
        }
      },
      include: { group: true },
      orderBy: { deadline: "asc" }
    });

    res.json(tasks || []);

  } catch (error) {
    console.error("TASK ERROR:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET SINGLE GROUP DETAILS (student view)
exports.getStudentGroupById = async (req, res) => {
  try {
    const userId = req.user.userId;
    const groupId = parseInt(req.params.id);

    // Verify student is a member
    const membership = await prisma.studentGroup.findUnique({
      where: { userId_groupId: { userId, groupId } }
    });

    if (!membership) {
      return res.status(403).json({ message: "You are not a member of this group" });
    }

    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        faculty: { select: { id: true, name: true, email: true } },
        students: { include: { user: { select: { id: true, name: true, email: true } } } },
        tasks: { orderBy: { deadline: "asc" } },
        project: true
      }
    });

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Flatten members for frontend
    const response = {
      ...group,
      members: group.students.map(sg => sg.user)
    };

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ADD / UPDATE PROJECT (student adds project to their group)
exports.upsertProject = async (req, res) => {
  try {
    const userId = req.user.userId;
    const groupId = parseInt(req.params.id);
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    // Verify membership
    const membership = await prisma.studentGroup.findUnique({
      where: { userId_groupId: { userId, groupId } }
    });

    if (!membership) {
      return res.status(403).json({ message: "Not a member of this group" });
    }

    const project = await prisma.project.upsert({
      where: { groupId },
      update: { title, description },
      create: { title, description, groupId }
    });

    res.json({ message: "Project saved", data: project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};