const express = require("express");
const router = express.Router();
const userController = require("../controller/usersController");
const { verifyAdmin, verifyAccessToken } = require("../middleware/authJWT");

router.post("/v1/hr", verifyAdmin, userController.addHr);
router.get("/v1/hr", verifyAdmin, userController.getHrData);
router.post(
  "/v1/marketing-manager",
  verifyAccessToken,
  userController.addMarketing
);
router.get(
  "/v1/marketing-manager",
  verifyAccessToken,
  userController.getMarketingManagerData
);
router.post("/v1/staff", verifyAccessToken, userController.addStaff);
router.get("/v1/staff", verifyAccessToken, userController.getStaffs);

module.exports = router;
