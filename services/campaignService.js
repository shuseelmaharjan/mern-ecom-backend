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

    const campaigns = await Campaign.find({
      startTime: { $gte: currentDateTime },
    });

    return campaigns;
  }

  async getInactiveExpiredCampaigns() {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const currentDate = new Date();

      const campaigns = await Campaign.find({
        isActive: false,
        expiryTime: { $lte: currentDate, $gte: thirtyDaysAgo },
      });

      return campaigns;
    } catch (error) {
      throw new Error("Error fetching campaigns: " + error.message);
    }
  }

  async updateCampaign(campaignId, updateData, performedBy) {
    try {
      const allowedFields = [
        "title",
        "description",
        "saleType",
        "startTime",
        "expiryTime",
        "discountPercentage",
        "priority",
        "showOnHeader",
      ];

      const filteredData = {};
      for (const key in updateData) {
        if (allowedFields.includes(key)) {
          filteredData[key] = updateData[key];
        }
      }

      const updatedCampaign = await Campaign.findByIdAndUpdate(
        campaignId,
        filteredData,
        { new: true, runValidators: true }
      );

      if (!updatedCampaign) {
        throw new Error("Campaign not found");
      }

      const log = new CampaignLog({
        action: "UPDATE",
        affectedObjectId: campaignId,
        performedBy,
        details: `Campaign "${updatedCampaign.title}" updated successfully.`,
      });

      await log.save();

      return updatedCampaign;
    } catch (error) {
      throw new Error(`Error updating campaign: ${error.message}`);
    }
  }

  async deleteCampaign(campaignId, performedBy) {
    try {
      const campaign = await Campaign.findByIdAndDelete(campaignId);

      if (!campaign) {
        throw new Error("Campaign not found");
      }

      const log = new CampaignLog({
        action: "DELETE",
        affectedObjectId: campaign._id,
        performedBy,
        details: `Campaign "${campaign.title}" deleted successfully.`,
      });

      await log.save();

      return campaign;
    } catch (error) {
      throw new Error(`Error deleting campaign: ${error.message}`);
    }
  }

  async getSpecificSaleDetails(saleType) {
    const validSaleTypes = ["SALE", "QUICKSALE", "FESTIVAL", "FREESHIPPING"];

    if (!validSaleTypes.includes(saleType.toUpperCase())) {
      throw new Error("Invalid saleType");
    }

    return await Campaign.find({
      isActive: true,
      saleType: saleType.toUpperCase(),
    });
  }
}

module.exports = new CampaignService();
