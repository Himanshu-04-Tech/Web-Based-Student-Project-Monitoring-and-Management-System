const express = require("express");
const router = express.Router();

const { createProject } = require("../controllers/projectController");
const { verifyToken } = require("../middleware/middlewareAuth");

router.post("/", verifyToken, createProject);

module.exports = router;