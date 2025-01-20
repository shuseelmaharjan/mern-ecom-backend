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

  async getFypService({ limit = 20, skip = 0 }) {
    const products = await Product.find({ active: true })
      .sort({ createdAt: -1, views: -1 })
      .skip(skip)
      .limit(limit)
      .select("title media price brand views");

    const recommendedProducts = [];
    for (const product of products) {
      const engagement = await Engagement.findOne({
        productId: product._id,
        expiryTime: { $gt: new Date() },
      }).populate("campaignId");

      let campaignDetails = null;
      if (engagement && engagement.campaignId.isActive) {
        const campaign = engagement.campaignId;
        campaignDetails = {
          saleType: campaign.saleType,
          expiryTime: campaign.expiryTime,
          discountPercentage: campaign.discountPercentage,
        };
      }

      recommendedProducts.push({
        productId: product._id,
        title: product.title,
        media: product.media?.images
          ?.filter((img) => img.default || true)
          .slice(0, 2),
        price: product.price,
        brand: product.brand || null,
        views: product.views,
        campaign: campaignDetails,
      });
    }

    return recommendedProducts;
  }

  async getRelatedProducts(productId, limit = 20) {
    try {
      const product = await Product.findById(productId);

      if (!product) {
        throw new Error("Product not found");
      }

      const { tags } = product;

      const relatedProducts = await Product.find({
        tags: { $in: tags },
        _id: { $ne: productId },
        active: true,
      })
        .sort({ views: -1, createdAt: -1 })
        .limit(limit)
        .select("title media price brand views");

      const recommendedProducts = [];

      for (const product of relatedProducts) {
        const engagement = await Engagement.findOne({
          productId: product._id,
          expiryTime: { $gt: new Date() },
        }).populate("campaignId");

        let campaignDetails = null;
        if (engagement && engagement.campaignId.isActive) {
          const campaign = engagement.campaignId;
          campaignDetails = {
            saleType: campaign.saleType,
            expiryTime: campaign.expiryTime,
            discountPercentage: campaign.discountPercentage,
          };
        }

        recommendedProducts.push({
          productId: product._id,
          title: product.title,
          media: product.media?.images
            ?.filter((img) => img.default || true)
            .slice(0, 2),
          price: product.price,
          brand: product.brand || null,
          views: product.views,
          campaign: campaignDetails,
        });
      }

      return recommendedProducts;
    } catch (error) {
      console.error("Error fetching related products:", error);
      throw error;
    }
  }

  async getProductsByGrandCategory(grandCategoryId, page = 1, limit = 2) {
    try {
      const skip = (page - 1) * limit;

      const products = await Product.find({
        categoryModel: "GrandCategory",
        category: grandCategoryId,
        active: true,
      })
        .skip(skip)
        .limit(limit);

      const result = [];
      for (const product of products) {
        let productDetails = {
          productId: product._id,
          title: product.title,
          media: product.media.images,
          price: product.price,
          brand: product.brand,
          views: product.views,
        };

        const engagement = await Engagement.findOne({
          productId: product._id,
        });

        if (engagement) {
          const campaign = await Campaign.findOne({
            _id: engagement.campaignId,
            isActive: true,
          });

          if (campaign) {
            productDetails.campaign = {
              saleType: campaign.saleType,
              expiryTime: campaign.expiryTime,
              discountPercentage: campaign.discountPercentage,
            };
          }
        }

        result.push(productDetails);
      }

      return result;
    } catch (error) {
      throw new Error("Error fetching products: " + error.message);
    }
  }
}

module.exports = new AlgorithmService();
