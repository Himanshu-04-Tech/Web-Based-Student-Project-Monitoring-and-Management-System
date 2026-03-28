const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// CREATE GROUP
exports.createGroup = async (req, res) => {
  try {
    const { name, batchId, purpose } = req.body;

    if (!name || !batchId || !purpose) {
      return res.status(400).json({
        message: "All fields required",
      });
    }
    let joinCode;
    let exists = true;

    // 🔥 ensure unique code
    while (exists) {
      joinCode = generateJoinCode();

      const existing = await prisma.group.findUnique({
        where: { joinCode },
      });

      if (!existing) exists = false;
    }
    const group = await prisma.group.create({
      data: {
        name,
        batchId: Number(batchId),
        purpose,
        joinCode,
      },
    });

    res.status(201).json({
      message: "Group created successfully",
      data: group,
    });

  } catch (error) {
    console.error(error);

    if (error.code === "P2003") {
      return res.status(400).json({
        message: "Invalid batchId",
      });
    }

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

function generateJoinCode(length = 7) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return code;
}
// GET ALL GROUPS
exports.getGroups = async (req, res) => {
  try {
    const groups = await prisma.group.findMany({
      include: {
        batch: {
          include: {
            division: true,
          },
        },
      },
    });

    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: "Error fetching groups" });
  }
};
exports.joinGroup = async (req, res) => {
  try {
    const { joinCode } = req.body;
    const userId = req.user.userId; // ✅ FIXED

    const group = await prisma.group.findUnique({
      where: { joinCode },
    });

    if (!group) {
      return res.status(404).json({ message: "Invalid join code" });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { groupId: group.id },
    });

    res.json({ message: "Joined group successfully" });

  } catch (err) {
    console.error(err); // ✅ ADD THIS
    res.status(500).json({ error: err.message });
  }
};
exports.getMyGroup = async (req, res) => {
  try {
    const userId = req.user.userId; // from JWT
    console.log("req.user:", req.user);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        group: {
          include: {
            batch: {
              include: {
                division: true,
              },
            },
            project: true,
          },
        },
      },
    });

    if (!user || !user.group) {
      return res.status(404).json({
        message: "User is not part of any group",
      });
    }

    res.json(user.group);

  } catch (error) {
    console.error(error); // ✅ VERY IMPORTANT
    res.status(500).json({
      message: "Error fetching group",
    });
  }
  
};