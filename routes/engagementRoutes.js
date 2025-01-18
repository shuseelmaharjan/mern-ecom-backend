const express = require("express");
const engagementController = require("../controller/engagementController");
const { verifyAccessToken } = require("../middleware/authJWT");

const router = express.Router();

router.post(
  "/v1/create-campaign-engaged",
  verifyAccessToken,
  engagementController.createEngagement
);

router.post(
  "/v1/check-engagement",
  verifyAccessToken,
  engagementController.checkEngagement
);

module.exports = router;
