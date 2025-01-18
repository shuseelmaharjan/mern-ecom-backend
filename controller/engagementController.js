const engagementService = require("../services/engagementService");
const GetUserId = require("../helper/getUserId");

class EngagementController {
  async createEngagement(req, res) {
    const id = new GetUserId(req);
    const userId = await id.getUserId();
    const { productId, campaignId, expiryTime } = req.body;

    if (!productId || !campaignId || !expiryTime) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: productId, campaignId, or expiryTime",
      });
    }

    try {
      const engagement = await engagementService.createEngagement(
        userId,
        productId,
        campaignId,
        expiryTime
      );
      return res.status(201).json({
        success: true,
        message: "Engagement created successfully",
        data: engagement,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async checkEngagement(req, res) {
    const { productId, campaignId } = req.body;

    try {
      const id = new GetUserId(req);
      const userId = await id.getUserId();

      const existingEngagement =
        await engagementService.checkExistingEngagement(
          userId,
          productId,
          campaignId
        );

      if (existingEngagement) {
        return res.status(200).json({
          success: true,
          message: "Engagement found",
          data: existingEngagement,
        });
      }

      return res.status(404).json({
        success: false,
        message: "No engagement found with the provided details",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new EngagementController();
