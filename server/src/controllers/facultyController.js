// controllers/facultyController.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getFacultyDashboard = async (req, res) => {
  try {
    const facultyId = req.user.userId;

    const teams = await prisma.group.findMany({
      where: { facultyId },
      include: {
        students: {          // ✅ was "users" — now use the StudentGroup join table
          include: {
            user: true       // include actual user data if needed
          }
        },
        tasks: true
      }
    });

    let totalTasks = 0;
    let completedTasks = 0;

    const formattedTeams = teams.map(team => {
      const teamTasks = team.tasks.length;
      const doneTasks = team.tasks.filter(t => t.completed).length;

      totalTasks += teamTasks;
      completedTasks += doneTasks;

      const progress =
        teamTasks === 0 ? 0 : Math.round((doneTasks / teamTasks) * 100);

      return {
        name: team.name,
        memberCount: team.students.length,  // ✅ was team.users.length
        totalTasks: teamTasks,
        completedTasks: doneTasks,
        progress
      };
    });

    const pendingTasks = totalTasks - completedTasks;

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
      deadlines: upcomingDeadlines.slice(0, 5),
      alerts: pendingTasks > 0 ? [`${pendingTasks} tasks pending`] : [],
      activity: ["Dashboard loaded"]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching dashboard" });
  }
};