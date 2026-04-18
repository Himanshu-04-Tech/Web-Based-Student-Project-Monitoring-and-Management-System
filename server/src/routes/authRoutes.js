const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const authController = require("../controllers/authController");
const { verifyToken } = require("../middleware/middlewareAuth");
const prisma = require("../prisma"); // adjust path if needed

router.post("/register", authController.register);
router.post("/login", authController.login);


router.put("/change-password", verifyToken, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
        });

        const isMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isMatch) {
            return res.status(400).json({ error: "Wrong password" });
        }

        const hashed = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashed },
        });

        res.json({ message: "Password updated" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

router.get("/me", verifyToken, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            },
        });

        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch user" });
    }
});

module.exports = router;
