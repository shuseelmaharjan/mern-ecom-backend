const CampaignService = require("../services/campaignService");
const RoleChecker = require("../helper/roleChecker");
const GetUserId = require("../helper/getUserId");

class CampaignController {
  async createCampaign(req, res) {
    try {
      const roleChecker = new RoleChecker(req);
      const userIdHelper = new GetUserId(req);

      const role = await roleChecker.getRole();
      const performedBy = await userIdHelper.getUserId();

      if (role !== "mm") {
        return res
          .status(403)
          .json({ message: "Unauthorized: Insufficient permissions." });
      }

      const data = req.body;
      const campaign = await CampaignService.createCampaign(data, performedBy);
      res.status(201).json({
        message: "Campaign created successfully!",
        campaignId: campaign._id,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
      console.log(error);
    }
  }

  async getActiveCampaigns(req, res) {
    try {
      const campaigns = await CampaignService.getCampaignsByActiveStatus(true);

      res.status(200).json({ success: true, data: campaigns });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getUpcomingCampaigns(req, res) {
    try {
      const campaigns = await CampaignService.getUpcomingCampaigns();
      res.status(200).json({ success: true, data: campaigns });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new CampaignController();
