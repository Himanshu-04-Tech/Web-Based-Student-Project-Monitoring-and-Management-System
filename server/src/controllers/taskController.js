const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createTask = async (req, res) => {
  try {
    const { title, deadline, groupId } = req.body;

    const task = await prisma.task.create({
      data: {
        title,
        deadline: new Date(deadline),
        groupId,
      },
    });

    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating task" });
  }
};
exports.getTasksByGroup = async (req, res) => {
  try {
    const groupId = parseInt(req.params.groupId);

    const tasks = await prisma.task.findMany({
      where: { groupId },
      orderBy: { deadline: "asc" },
    });

    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching tasks" });
  }
};
exports.toggleTaskStatus = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const task = await prisma.task.findUnique({ where: { id } });

    const updated = await prisma.task.update({
      where: { id },
      data: {
        completed: !task.completed,
      },
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating task" });
  }
};
exports.updateDeadline = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { deadline } = req.body;

    const updated = await prisma.task.update({
      where: { id },
      data: {
        deadline: new Date(deadline),
      },
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating deadline" });
  }
};
exports.deleteTask = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    await prisma.task.delete({
      where: { id },
    });

    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting task" });
  }
};