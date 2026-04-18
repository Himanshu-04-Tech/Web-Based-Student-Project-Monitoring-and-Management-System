// controllers/facultyController.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getFacultyDashboard = async (req, res) => {
  try {
    const facultyId = req.user.userId; // ✅ FIX

    const teams = await prisma.group.findMany({
      where: { facultyId },
      include: {
        users: true,   // ✅ FIX
        tasks: true
      }
    });

    let totalTasks = 0;
    let completedTasks = 0;

    const formattedTeams = teams.map(team => {
      const teamTasks = team.tasks.length;
      const doneTasks = team.tasks.filter(t => t.completed).length; // ✅ FIX

      totalTasks += teamTasks;
      completedTasks += doneTasks;

      const progress =
        teamTasks === 0 ? 0 : Math.round((doneTasks / teamTasks) * 100);

      return {
        name: team.name,
        members: team.users.length,
        progress
      };
    });

    const pendingTasks = totalTasks - completedTasks;
    console.log("Logged in faculty:", req.user.userId);

    // 🔥 ADD EXTRA DATA FOR DASHBOARD
    const upcomingDeadlines = [];

    teams.forEach(team => {
      team.tasks.forEach(task => {
        if (!task.completed) {
          upcomingDeadlines.push({
            teamName: team.name,
            title: task.title,
            date: task.deadline
          });
        }
      });
    });

    res.json({
      totalTeams: teams.length,
      totalTasks,
      completedTasks,
      pendingTasks,
      teams: formattedTeams,
      deadlines: upcomingDeadlines.slice(0, 5), // limit
      alerts: pendingTasks > 0 ? [`${pendingTasks} tasks pending`] : [],
      activity: ["Dashboard loaded"] // simple for now
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching dashboard" });
  }
};