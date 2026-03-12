const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createDivision = async (req, res) => {
  try {
    const { name } = req.body;

    const division = await prisma.division.create({
      data: {
        name,
        facultyId: req.user.userId
      }
    });

    res.status(201).json(division);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getDivisions = async (req, res) => {
  try {
    const divisions = await prisma.division.findMany();
    res.json(divisions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};