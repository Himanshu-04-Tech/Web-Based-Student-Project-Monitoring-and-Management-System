const jwt = require("jsonwebtoken");

// ================= VERIFY TOKEN =================
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  // contains userId and role
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid token." });
    }
};

// ================= ROLE AUTH =================
const allowRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden: Access denied." });
        }
        next();
    };
};

// ✅ Proper Export
module.exports = {
    verifyToken,
    allowRoles
};