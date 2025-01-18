const { Campaign } = require("../models/campaign");
const Engagement = require("../models/engagement");
const Product = require("../models/product");

class AlgorithmService {
  async getFlashSaleProducts() {
    try {
      const flashSaleCampaigns = await Campaign.find({
        isActive: true,
        priority: "FLASHSALE",
      }).select("_id discountPercentage");

      if (flashSaleCampaigns.length === 0) {
        throw new Error("No active FLASHSALE campaigns found");
      }

      //Find products engaged in these campaigns
      const campaignIds = flashSaleCampaigns.map((campaign) => campaign._id);
      const engagedProducts = await Engagement.find({
        campaignId: { $in: campaignIds },
      }).select("productId campaignId");

      if (engagedProducts.length === 0) {
        throw new Error("No products found for FLASHSALE campaigns");
      }

      const productIds = engagedProducts.map(
        (engagement) => engagement.productId
      );

      const products = await Product.find({
        _id: { $in: productIds },
        active: true,
      }).sort({
        views: -1,
      });

      if (products.length === 0) {
        throw new Error("No active products found");
      }

      const productsWithDiscount = products.map((product) => {
        const productEngagement = engagedProducts.find(
          (engagement) =>
            engagement.productId.toString() === product._id.toString()
        );
        const campaign = flashSaleCampaigns.find(
          (campaign) =>
            campaign._id.toString() === productEngagement.campaignId.toString()
        );
        return {
          ...product.toObject(),
          discountPercentage: campaign ? campaign.discountPercentage : 0,
        };
      });

      return productsWithDiscount;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AlgorithmService();
