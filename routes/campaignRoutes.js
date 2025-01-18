const express = require("express");
const CampaignController = require("../controller/campaignController");

const { upload, processImage } = require("../middleware/bannerProcessor");

const router = express.Router();

router.post(
  "/v1/create-campaign",
  upload.single("image"),
  processImage,
  CampaignController.createCampaign
);
router.get("/v1/campaigns/active", CampaignController.getActiveCampaigns);
router.get("/v1/campaigns/upcoming", CampaignController.getUpcomingCampaigns);
router.get(
  "/v1/campaigns/expired",
  CampaignController.getInactiveExpiredCampaigns
);

router.put(
  "/v1/update-campaign/:campaignId",
  upload.single("image"),
  processImage,
  CampaignController.updateCampaign
);

router.delete("/v1/delete-campaign/:id", CampaignController.deleteCampaign);
router.get(
  "/v1/launched-campaigns/:saleType",
  CampaignController.getCampaignBySaleType
);

//user portal
router.get("/v1/banner-campaigns", CampaignController.getBannerForHomepage);
router.get("/v1/header-campaigns", CampaignController.getHeaderCampaign);

module.exports = router;
