const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createBatch = async (req, res) => {
  try {
    const { name, divisionId } = req.body;

    if (!name || !divisionId) {
      return res.status(400).json({
        message: "All fields required",
      });
    }

    const batch = await prisma.batch.create({
      data: {
        name,
        divisionId: Number(divisionId),
      },
    });

    return res.status(201).json({
      message: "Batch created successfully",
      data: batch,
    });

  } catch (error) {
    console.error(error);

    //  Handle Prisma Foreign Key Error
    if (error.code === "P2003") {
      return res.status(400).json({
        message: "Invalid divisionId (division does not exist)",
      });
    }

    // Handle duplicate 
    if (error.code === "P2002") {
      return res.status(400).json({
        message: "Batch already exists",
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
exports.getAllBatches  = async (req, res) => {
  try {
    const batches = await prisma.batch.findMany({
      include: {
        division: true,
      },
    });

    res.json(batches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getBatchById = async (req, res) => {
  try {
    const { id } = req.params;

    const batch = await prisma.batch.findUnique({
      where: { id: Number(id) },
      include: { division: true },
    });

    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    res.status(200).json(batch);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching batch" });
  }
};
exports.updateBatch = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, divisionId } = req.body;

    // optional validation
    if (!name && !divisionId) {
      return res.status(400).json({
        message: "At least one field required to update",
      });
    }

    const updatedBatch = await prisma.batch.update({
      where: { id: Number(id) },
      data: {
        ...(name && { name }),
        ...(divisionId && { divisionId: Number(divisionId) }),
      },
    });

    return res.json({
      message: "Batch updated successfully",
      data: updatedBatch,
    });

  } catch (error) {
    console.error(error);

    if (error.code === "P2025") {
      return res.status(404).json({
        message: "Batch not found",
      });
    }

    if (error.code === "P2003") {
      return res.status(400).json({
        message: "Invalid divisionId",
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};


exports.deleteBatch = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.batch.delete({
      where: { id: Number(id) },
    });

    return res.json({
      message: "Batch deleted successfully",
    });

  } catch (error) {
    console.error(error);

    if (error.code === "P2025") {
      return res.status(404).json({
        message: "Batch not found",
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};