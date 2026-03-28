const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createProject = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.userId;

    // get user's group
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { group: true },
    });

    if (!user || !user.group) {
      return res.status(400).json({
        message: "User not in a group",
      });
    }

    // check if project already exists
    const existing = await prisma.project.findUnique({
      where: { groupId: user.group.id },
    });

    if (existing) {
      return res.status(400).json({
        message: "Project already exists for this group",
      });
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        groupId: user.group.id,
      },
    });

    res.json(project);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating project" });
  }
};