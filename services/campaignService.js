const { Campaign, CampaignLog } = require("../models/campaign");
const moment = require("moment");

class CampaignService {
  async createCampaign(data, performedBy) {
    try {
      const {
        saleType,
        title,
        description,
        startTime,
        expiryTime,
        image = null,
        discountPercentage = null,
        minimumOrderValue = null,
        isHeader = false,
        priority,
      } = data;

      const campaign = new Campaign({
        saleType,
        title,
        description,
        startTime,
        expiryTime,
        image,
        discountPercentage,
        minimumOrderValue,
        isHeader,
        priority,
        totalVisits: 0,
        totalSales: 0,
        totalRevenue: 0,
        isActive: false,
      });

      const savedCampaign = await campaign.save();

      const log = new CampaignLog({
        action: "CREATE",
        affectedObjectId: savedCampaign._id,
        performedBy,
        details: `Campaign "${savedCampaign.title}" created successfully.`,
      });

      await log.save();

      return savedCampaign;
    } catch (error) {
      throw new Error(`Error creating campaign: ${error.message}`);
    }
  }

  async getCampaignsByActiveStatus(isActive) {
    return await Campaign.find({ isActive });
  }

  async getUpcomingCampaigns() {
    const currentDateTime = new Date();
    console.log("Current Date and Time:", currentDateTime);

    const campaigns = await Campaign.find({
      startTime: { $gte: currentDateTime },
    });
    console.log("Query Results:", campaigns);

    return campaigns;
  }
}

module.exports = new CampaignService();
