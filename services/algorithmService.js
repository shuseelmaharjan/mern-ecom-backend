const { Campaign } = require("../models/campaign");
const Engagement = require("../models/engagement");
const Product = require("../models/product");
const { Category } = require("../models/categories");

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

  async getProductsBySubCategory(subCategoryId, page = 1, limit = 2) {
    try {
      const category = await Category.findOne({
        "subCategories._id": subCategoryId,
      });

      if (!category) {
        throw new Error("Category not found for the provided subcategory");
      }

      let products = await Product.find({
        categoryModel: "SubCategory",
        category: subCategoryId,
        active: true,
      })
        .skip((page - 1) * limit)
        .limit(limit);

      if (products.length === 0) {
        const subCategory = category.subCategories.find(
          (sub) => sub._id.toString() === subCategoryId.toString()
        );

        if (subCategory && subCategory.grandCategories.length > 0) {
          const grandCategoryIds = subCategory.grandCategories.map(
            (grandCat) => grandCat._id
          );
          products = await Product.find({
            categoryModel: "GrandCategory",
            category: { $in: grandCategoryIds },
            active: true,
          })
            .skip((page - 1) * limit)
            .limit(limit);
        }
      }

      const productsWithCampaign = await Promise.all(
        products.map(async (product) => {
          const engagement = await Engagement.findOne({
            productId: product._id,
          }).populate("campaignId");

          if (engagement) {
            const campaign = engagement.campaignId;
            const isValidCampaign =
              campaign &&
              campaign.isActive &&
              new Date() < new Date(campaign.expiryTime);

            if (isValidCampaign) {
              product.campaign = {
                saleType: campaign.saleType,
                expiryTime: campaign.expiryTime,
                discountPercentage: campaign.discountPercentage,
              };
            }
          }

          const defaultImage = product.media.images.find(
            (image) => image.default
          );

          const secondImage = product.media.images[1];

          const productDetails = {
            _id: product._id,
            title: product.title,
            price: product.price,
            category: product.category,
            defaultImage: defaultImage ? defaultImage.url : null,
            secondImage: secondImage ? secondImage.url : null,
            colors: product.colors?.details || [],
            size: product.size || [],
            materials: product.materials || [],
            tags: product.tags || [],
            campaign: product.campaign,
          };

          return productDetails;
        })
      );

      return productsWithCampaign;
    } catch (error) {
      console.error("Error fetching products for the subcategory:", error);
      throw new Error("Error fetching products for the subcategory");
    }
  }

  async getFilteredProductsBySubCategory(
    subCategoryId,
    filters,
    page = 1,
    limit = 2
  ) {
    try {
      const category = await Category.findOne({
        "subCategories._id": subCategoryId,
      });

      if (!category) {
        throw new Error("Category not found for the provided subcategory");
      }

      const filterCriteria = {
        categoryModel: "SubCategory",
        category: subCategoryId,
        active: true,
      };

      if (filters.size && filters.size.length > 0) {
        filterCriteria.size = { $in: filters.size };
      }

      if (filters.brand) {
        filterCriteria.brand = filters.brand;
      }

      if (filters.price) {
        const [minPrice, maxPrice] = filters.price.split("-");
        filterCriteria.price = { $gte: minPrice, $lte: maxPrice };
      }

      if (filters.tags && filters.tags.length > 0) {
        filterCriteria.tags = { $in: filters.tags };
      }

      if (filters.materials && filters.materials.length > 0) {
        filterCriteria.materials = { $in: filters.materials };
      }

      let products = await Product.find(filterCriteria)
        .skip((page - 1) * limit)
        .limit(limit);

      if (products.length === 0) {
        const subCategory = category.subCategories.find(
          (sub) => sub._id.toString() === subCategoryId.toString()
        );

        if (subCategory && subCategory.grandCategories.length > 0) {
          const grandCategoryIds = subCategory.grandCategories.map(
            (grandCat) => grandCat._id
          );

          filterCriteria.categoryModel = "GrandCategory";
          filterCriteria.category = { $in: grandCategoryIds };

          products = await Product.find(filterCriteria)
            .skip((page - 1) * limit)
            .limit(limit);
        }
      }

      const productsWithCampaign = await Promise.all(
        products.map(async (product) => {
          const engagement = await Engagement.findOne({
            productId: product._id,
          }).populate("campaignId");

          if (engagement) {
            const campaign = engagement.campaignId;
            const isValidCampaign =
              campaign &&
              campaign.isActive &&
              new Date() < new Date(campaign.expiryTime);

            if (isValidCampaign) {
              product.campaign = {
                saleType: campaign.saleType,
                expiryTime: campaign.expiryTime,
                discountPercentage: campaign.discountPercentage,
              };
            }
          }

          const defaultImage = product.media.images.find(
            (image) => image.default
          );
          const secondImage = product.media.images[1];

          return {
            _id: product._id,
            title: product.title,
            price: product.price,
            category: product.category,
            defaultImage: defaultImage ? defaultImage.url : null,
            secondImage: secondImage ? secondImage.url : null,
            colors: product.colors?.details || [],
            size: product.size || [],
            materials: product.materials || [],
            tags: product.tags || [],
            campaign: product.campaign,
          };
        })
      );

      return productsWithCampaign;
    } catch (error) {
      console.error("Error fetching filtered products by subcategory:", error);
      throw new Error("Error fetching filtered products by subcategory");
    }
  }

  async getProductsByGrandCategory(grandCategoryId, page = 1, limit = 2) {
    try {
      const skip = (page - 1) * limit;

      // Fetch products from the GrandCategory
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
          price: product.price,
          brand: product.brand,
          views: product.views,

          colors: product.colors?.details || [],
          size: product.size || [],
          materials: product.materials || [],
          tags: product.tags || [],
        };

        const defaultImage = product.media.images.find(
          (image) => image.default
        );

        const secondImage = product.media.images[1];

        productDetails.defaultImage = defaultImage ? defaultImage.url : null;

        productDetails.secondImage = secondImage ? secondImage.url : null;

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

  async getProductsByCategory(categoryId, page = 1, limit = 2) {
    try {
      const category = await Category.findById(categoryId);

      if (!category) {
        throw new Error("Category not found for the provided category ID");
      }

      let products = await Product.find({
        categoryModel: "Category",
        category: categoryId,
        active: true,
      })
        .skip((page - 1) * limit)
        .limit(limit);

      if (products.length === 0) {
        if (category.subCategories.length > 0) {
          const subCategoryIds = category.subCategories.map(
            (subCategory) => subCategory._id
          );
          products = await Product.find({
            categoryModel: "SubCategory",
            category: { $in: subCategoryIds },
            active: true,
          })
            .skip((page - 1) * limit)
            .limit(limit);
        }
      }

      if (products.length === 0) {
        if (category.subCategories.length > 0) {
          const grandCategoryIds = category.subCategories
            .map((subCategory) => subCategory.grandCategories)
            .flat()
            .map((grandCategory) => grandCategory._id);

          products = await Product.find({
            categoryModel: "GrandCategory",
            category: { $in: grandCategoryIds },
            active: true,
          })
            .skip((page - 1) * limit)
            .limit(limit);
        }
      }

      const productsWithCampaign = await Promise.all(
        products.map(async (product) => {
          const engagement = await Engagement.findOne({
            productId: product._id,
          }).populate("campaignId");

          if (engagement) {
            const campaign = engagement.campaignId;
            const isValidCampaign =
              campaign &&
              campaign.isActive &&
              new Date() < new Date(campaign.expiryTime);

            if (isValidCampaign) {
              product.campaign = {
                saleType: campaign.saleType,
                expiryTime: campaign.expiryTime,
                discountPercentage: campaign.discountPercentage,
              };
            }
          }

          const defaultImage = product.media.images.find(
            (image) => image.default
          );

          const secondImage = product.media.images[1];

          const productDetails = {
            _id: product._id,
            title: product.title,
            price: product.price,
            category: product.category,
            defaultImage: defaultImage ? defaultImage.url : null,
            secondImage: secondImage ? secondImage.url : null,
            colors: product.colors?.details || [],
            size: product.size || [],
            materials: product.materials || [],
            tags: product.tags || [],
            campaign: product.campaign,
          };

          return productDetails;
        })
      );

      return productsWithCampaign;
    } catch (error) {
      console.error("Error fetching products for the category:", error);
      throw new Error("Error fetching products for the category");
    }
  }

  async getFilteredProductsByCategory(
    categoryId,
    filters,
    page = 1,
    limit = 2
  ) {
    try {
      const category = await Category.findById(categoryId).populate({
        path: "subCategories",
        populate: { path: "grandCategories" },
      });

      if (!category) {
        throw new Error("Category not found for the provided category ID");
      }

      const subCategoryIds = category.subCategories.map((sub) => sub._id);
      const grandCategoryIds = category.subCategories
        .flatMap((sub) => sub.grandCategories)
        .map((grand) => grand._id);

      const filterCriteria = {
        active: true,
        $or: [
          { categoryModel: "Category", category: categoryId },
          { categoryModel: "SubCategory", category: { $in: subCategoryIds } },
          {
            categoryModel: "GrandCategory",
            category: { $in: grandCategoryIds },
          },
        ],
      };

      if (filters.size && filters.size.length > 0) {
        filterCriteria.size = { $in: filters.size };
      }

      if (filters.brand) {
        filterCriteria.brand = filters.brand;
      }

      if (filters.price) {
        const [minPrice, maxPrice] = filters.price.split("-");
        filterCriteria.price = { $gte: minPrice, $lte: maxPrice };
      }

      if (filters.tags && filters.tags.length > 0) {
        filterCriteria.tags = { $in: filters.tags };
      }

      if (filters.materials && filters.materials.length > 0) {
        filterCriteria.materials = { $in: filters.materials };
      }

      let products = await Product.find(filterCriteria)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("categoryModel category");

      const productsWithCampaign = await Promise.all(
        products.map(async (product) => {
          const engagement = await Engagement.findOne({
            productId: product._id,
          }).populate("campaignId");

          if (engagement) {
            const campaign = engagement.campaignId;
            const isValidCampaign =
              campaign &&
              campaign.isActive &&
              new Date() < new Date(campaign.expiryTime);

            if (isValidCampaign) {
              product.campaign = {
                saleType: campaign.saleType,
                expiryTime: campaign.expiryTime,
                discountPercentage: campaign.discountPercentage,
              };
            }
          }

          const defaultImage = product.media.images.find(
            (image) => image.default
          );
          const secondImage = product.media.images[1];

          return {
            _id: product._id,
            title: product.title,
            price: product.price,
            category: product.category,
            defaultImage: defaultImage ? defaultImage.url : null,
            secondImage: secondImage ? secondImage.url : null,
            colors: product.colors?.details || [],
            size: product.size || [],
            materials: product.materials || [],
            tags: product.tags || [],
            campaign: product.campaign,
          };
        })
      );

      return productsWithCampaign;
    } catch (error) {
      console.error("Error fetching filtered products by category:", error);
      throw new Error("Error fetching filtered products by category");
    }
  }
}

module.exports = new AlgorithmService();
