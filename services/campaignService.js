const { Campaign, CampaignLog } = require("../models/campaign");
const Engagement = require("../models/engagement");

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
        banner = null,
        poster = null,
        discountPercentage = null,
        priority,
      } = data;

      const campaign = new Campaign({
        saleType,
        title,
        description,
        startTime,
        expiryTime,
        image,
        banner,
        poster,
        discountPercentage,
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
    try {
      const campaigns = await Campaign.find({ isActive });

      const engagementCounts = await Engagement.aggregate([
        { $match: { campaignId: { $in: campaigns.map((c) => c._id) } } },
        {
          $group: {
            _id: "$campaignId",
            totalEngagements: { $sum: 1 },
          },
        },
      ]);

      const campaignsWithEngagements = campaigns.map((campaign) => {
        const engagement = engagementCounts.find((e) =>
          e._id.equals(campaign._id)
        );
        return {
          ...campaign.toObject(),
          totalEngagements: engagement ? engagement.totalEngagements : 0,
        };
      });

      return campaignsWithEngagements;
    } catch (error) {
      console.error("Error fetching campaigns with engagement counts:", error);
      throw error;
    }
  }

  async getUpcomingCampaigns() {
    const currentDateTime = new Date();

    const campaigns = await Campaign.find({
      startTime: { $gte: currentDateTime },
    });

    const engagementCounts = await Engagement.aggregate([
      { $match: { campaignId: { $in: campaigns.map((c) => c._id) } } },
      {
        $group: {
          _id: "$campaignId",
          totalEngagements: { $sum: 1 },
        },
      },
    ]);

    const campaignsWithEngagements = campaigns.map((campaign) => {
      const engagement = engagementCounts.find((e) =>
        e._id.equals(campaign._id)
      );
      return {
        ...campaign.toObject(),
        totalEngagements: engagement ? engagement.totalEngagements : 0,
      };
    });

    return campaignsWithEngagements;
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

      const engagementCounts = await Engagement.aggregate([
        { $match: { campaignId: { $in: campaigns.map((c) => c._id) } } },
        {
          $group: {
            _id: "$campaignId",
            totalEngagements: { $sum: 1 },
          },
        },
      ]);

      const campaignsWithEngagements = campaigns.map((campaign) => {
        const engagement = engagementCounts.find((e) =>
          e._id.equals(campaign._id)
        );
        return {
          ...campaign.toObject(),
          totalEngagements: engagement ? engagement.totalEngagements : 0,
        };
      });

      return campaignsWithEngagements;
    } catch (error) {
      throw new Error("Error fetching campaigns: " + error.message);
    }
  }

  async updateCampaign(campaignId, updateData, performedBy) {
    // console.log(updateData);
    try {
      const allowedFields = [
        "title",
        "description",
        "saleType",
        "startTime",
        "expiryTime",
        "discountPercentage",
        "priority",
        "image",
        "banner",
        "poster",
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
    const validSaleTypes = ["SALE", "BRAND", "FESTIVAL", "FREESHIPPING"];

    if (!validSaleTypes.includes(saleType.toUpperCase())) {
      throw new Error("Invalid saleType");
    }

    return await Campaign.find({
      isActive: true,
      saleType: saleType.toUpperCase(),
    });
  }

  async getBannerForHomepage() {
    try {
      const campaigns = await Campaign.find({
        priority: "BANNER",
        isActive: true,
      }).select("title description banner discountPercentage");
      return campaigns;
    } catch (error) {
      throw new Error("Error fetching campaigns: " + error.message);
    }
  }

  async getHeaderCampaign() {
    try {
      const campaigns = await Campaign.find({
        priority: "HEADER",
        isActive: true,
      }).select("title description banner discountPercentage");
      return campaigns;
    } catch (error) {
      throw new Error("Error fetching campaigns: " + error.message);
    }
  }

  async getDeal() {
    try {
      const campaigns = await Campaign.find({
        priority: "DEAL",
        isActive: true,
      }).select("title description image poster discountPercentage");
      return campaigns;
    } catch (error) {
      throw new Error("Error fetching campaigns: " + error.message);
    }
  }

  async activeCampaignDetails() {
    try {
      const isHeaderActive = !!(await Campaign.findOne({
        priority: "HEADER",
        isActive: true,
      }));
      const isBannerActive = !!(await Campaign.findOne({
        priority: "BANNER",
        isActive: true,
      }));
      const isDealActive = !!(await Campaign.findOne({
        priority: "DEAL",
        isActive: true,
      }));
      const isHomeActive = !!(await Campaign.findOne({
        priority: "HOME",
        isActive: true,
      }));

      let homeSaleTypes = null;
      if (isHomeActive) {
        homeSaleTypes = {
          SALE: !!(await Campaign.findOne({
            priority: "HOME",
            isActive: true,
            saleType: "SALE",
          })),
          BRAND: !!(await Campaign.findOne({
            priority: "HOME",
            isActive: true,
            saleType: "BRAND",
          })),
          FESTIVAL: !!(await Campaign.findOne({
            priority: "HOME",
            isActive: true,
            saleType: "FESTIVAL",
          })),
          FREESHIPPING: !!(await Campaign.findOne({
            priority: "HOME",
            isActive: true,
            saleType: "FREESHIPPING",
          })),
        };
      }

      return {
        isHeaderActive,
        isBannerActive,
        isDealActive,
        isHomeActive,
        homeSaleTypes,
      };
    } catch (error) {
      console.error("Error in CampaignService:", error.message);
      throw new Error("Error retrieving campaign status.");
    }
  }
}

module.exports = new CampaignService();
