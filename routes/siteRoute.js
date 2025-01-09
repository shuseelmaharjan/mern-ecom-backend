const express = require("express");
const siteController = require("../controller/siteController");
const router = express.Router();
const { verifyAdmin } = require("../middleware/authJWT");
const siteLogoUploader = require("../middleware/siteLogoUploader");

router.post(
  "/site-manager",
  verifyAdmin,
  siteLogoUploader.single("logo"),
  siteController.createSiteManagerData
);

router.get("/site-manager", siteController.getSiteManagerData);

module.exports = router;
