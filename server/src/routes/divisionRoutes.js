const express = require("express");
const router = express.Router();

const divisionController = require("../controllers/divisionController");
const { verifyToken, allowRoles } = require("../middleware/middlewareAuth");

router.post(
  "/",
  verifyToken,
  allowRoles("FACULTY"),
  divisionController.createDivision
);

router.get(
  "/",
  verifyToken,
  divisionController.getDivisions
);

module.exports = router;