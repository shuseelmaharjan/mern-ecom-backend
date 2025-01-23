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
      console.log("Received campaign data:", data);

      const campaign = await CampaignService.createCampaign(data, performedBy);
      res.status(201).json({
        message: "Campaign created successfully!",
        campaignId: campaign._id,
      });
    } catch (error) {
      console.error("Error creating campaign:", error);
      res.status(400).json({ error: error.message });
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

  async getInactiveExpiredCampaigns(req, res) {
    try {
      const campaigns = await CampaignService.getInactiveExpiredCampaigns();
      res.status(200).json({ success: true, data: campaigns });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async updateCampaign(req, res) {
    try {
      const roleChecker = new RoleChecker(req);
      const userIdHelper = new GetUserId(req);

      const role = await roleChecker.getRole();
      const performedBy = await userIdHelper.getUserId();

      if (!role || !performedBy) {
        throw new Error("Failed to retrieve role or user ID.");
      }

      if (role !== "mm") {
        return res
          .status(403)
          .json({ message: "Unauthorized: Insufficient permissions." });
      }

      const { campaignId } = req.params;

      const updateData = { ...req.body };

      const updatedCampaign = await CampaignService.updateCampaign(
        campaignId,
        updateData,
        performedBy
      );

      res.status(200).json({
        message: "Campaign updated successfully!",
        data: updatedCampaign,
      });
    } catch (error) {
      console.error("Error updating campaign:", error.message, error.stack);
      res.status(400).json({ error: error.message });
    }
  }

  async deleteCampaign(req, res) {
    try {
      const { id } = req.params;

      const roleChecker = new RoleChecker(req);
      const userIdHelper = new GetUserId(req);

      const role = await roleChecker.getRole();
      const performedBy = await userIdHelper.getUserId();
      console.log(role);

      if (role !== "mm") {
        return res
          .status(403)
          .json({ message: "Unauthorized: Insufficient permissions." });
      }

      const deletedCampaign = await CampaignService.deleteCampaign(
        id,
        performedBy
      );

      res.status(200).json({
        message: "Campaign deleted successfully",
        deletedCampaign,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message || "Error deleting campaign",
      });
    }
  }

  async getCampaignBySaleType(req, res) {
    const { saleType } = req.params;
    try {
      const campaigns = await CampaignService.getSpecificSaleDetails(saleType);
      res.status(200).json(campaigns);
    } catch (error) {
      console.error("Error fetching campaigns", error.message);
      res.status(400).json({ error: error.message });
    }
  }

  async getBannerForHomepage(req, res) {
    try {
      const campaigns = await CampaignService.getBannerForHomepage();
      res.status(200).json({
        success: true,
        message: "Banner campaigns fetched successfully",
        data: campaigns,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching banner campaigns",
        error: error.message,
      });
    }
  }

  async getHeaderCampaign(req, res) {
    try {
      const campaigns = await CampaignService.getHeaderCampaign();
      res.status(200).json({
        success: true,
        message: "Banner campaigns fetched successfully",
        data: campaigns,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching banner campaigns",
        error: error.message,
      });
    }
  }
}

module.exports = new CampaignController();
