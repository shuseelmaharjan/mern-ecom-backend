const express = require("express");
const EmployeeController = require("../controller/employeeController");
const { verifyAdmin, verifyHr } = require("../middleware/authJWT");

const router = express.Router();

router.get(
  "/v1/active-employees",
  verifyAdmin,
  EmployeeController.getActiveEmployees
);

router.get("/v1/active-staffs", verifyHr, EmployeeController.getActiveStaffs);

module.exports = router;
