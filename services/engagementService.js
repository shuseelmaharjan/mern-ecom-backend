const Engagement = require("../models/engagement");
const Product = require("../models/product");
const { Campaign } = require("../models/campaign");
const User = require("../models/users");

class EngagementService {
  async createEngagement(userId, productId, campaignId, expiryTime) {
    try {
      const product = await Product.findById(productId);
      const campaign = await Campaign.findById(campaignId);
      const user = await User.findById(userId);

      if (!product || !campaign || !user) {
        throw new Error("Invalid product, campaign or user");
      }

      const newEngagement = new Engagement({
        userId,
        productId,
        campaignId,
        expiryTime,
      });

      return await newEngagement.save();
    } catch (error) {
      throw new Error("Error creating engagement: " + error.message);
    }
  }

  async checkExistingEngagement(userId, productId, campaignId) {
    try {
      const engagement = await Engagement.findOne({
        userId,
        productId,
        campaignId,
      });

      if (engagement) {
        return {
          createdAt: engagement.createdAt,
          expiryTime: engagement.expiryTime,
        };
      }
      return null;
    } catch (error) {
      throw new Error("Error checking existing engagement: " + error.message);
    }
  }
}

module.exports = new EngagementService();
