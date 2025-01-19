const Product = require("../models/product");
const { Category } = require("../models/categories");
const mongoose = require("mongoose");
const Engagement = require("../models/engagement");
const Shop = require("../models/shop");
const { Campaign } = require("../models/campaign");

class ProductService {
  async getCategoryType(categoryId) {
    console.log("Requested Category ID:", categoryId);

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      throw new Error("Invalid category ID format.");
    }

    const categoryObjectId = new mongoose.Types.ObjectId(categoryId);

    const category = await Category.findOne({ _id: categoryObjectId }).exec();
    if (category) {
      return { type: "Category", category };
    }

    const subCategory = await Category.aggregate([
      { $unwind: "$subCategories" },
      { $match: { "subCategories._id": categoryObjectId } },
      {
        $project: {
          _id: 0,
          category: "$name",
          subCategory: "$subCategories.name",
        },
      },
    ]);
    if (subCategory.length > 0) {
      return { type: "SubCategory", subCategory: subCategory[0] };
    }

    const grandCategory = await Category.aggregate([
      { $unwind: "$subCategories" },
      { $unwind: "$subCategories.grandCategories" },
      { $match: { "subCategories.grandCategories._id": categoryObjectId } },
      {
        $project: {
          _id: 0,
          grandCategory: "$subCategories.grandCategories.name",
        },
      },
    ]);
    if (grandCategory.length > 0) {
      return { type: "GrandCategory", grandCategory: grandCategory[0] };
    }

    return null;
  }

  async createProduct(productData, userId) {
    const { files, category } = productData;

    const categoryType = await this.getCategoryType(category);

    if (!categoryType) {
      throw new Error(
        "Invalid category ID. It must be a valid Category, SubCategory, or GrandCategory."
      );
    }

    console.log("Category Type:", categoryType.type);
    console.log("Category Data:", categoryType);

    let media = { images: [] };

    for (let i = 1; i <= 8; i++) {
      const imgKey = `img${i}`;
      if (files && files[imgKey] && files[imgKey][0]?.path) {
        const isDefault = i === 1;
        media.images.push({ url: files[imgKey][0].path, default: isDefault });
      }
    }

    const size = Array.isArray(productData.size)
      ? productData.size
      : typeof productData.size === "string"
      ? productData.size.split(",")
      : [];

    const tags = Array.isArray(productData.tags)
      ? productData.tags
      : typeof productData.tags === "string"
      ? productData.tags.split(",")
      : [];

    const materials = Array.isArray(productData.materials)
      ? productData.materials
      : [];

    let productColors = [];
    if (productData.productColors) {
      try {
        productColors = JSON.parse(productData.productColors);
      } catch (error) {
        throw new Error("Invalid JSON format for productColors.");
      }
    }

    if (productData.productColor) {
      if (!Array.isArray(productColors) || productColors.length === 0) {
        throw new Error("Product colors must be a non-empty array.");
      }

      productColors.forEach((color) => {
        if (!color.code || !/^#[0-9A-Fa-f]{6}$/.test(color.code)) {
          throw new Error(
            `Invalid color code: ${color.code}. It should be a valid hex code.`
          );
        }
        if (!color.color || typeof color.color !== "string") {
          throw new Error(
            `Invalid color name: ${color.color}. It should be a valid string.`
          );
        }
      });
    }

    const colors = {
      isEnabled: productData.productColor || false,
      details: productData.productColor
        ? productColors.map((color) => ({
            code: color.code,
            name: color.color,
          }))
        : [],
    };

    const product = new Product({
      ...productData,
      createdBy: userId,
      category,
      categoryModel: categoryType.type,
      thumbnail: files?.thumbnail ? files.thumbnail[0].path : undefined,
      video: files?.video ? files.video[0].path : undefined,
      dimension: productData.dimension
        ? JSON.parse(productData.dimension)
        : undefined,
      size,
      tags,
      materials,
      colors,
      dimension: {
        isEnabled: productData.productDimension || false,
        details: productData.productDimension
          ? {
              width: productData.productWidth,
              height: productData.productHeight,
            }
          : null,
      },
      media,
      shipping: {
        service: productData.shippingService,
        processingTime: productData.shippingTime,
        freeShipping: productData.freeShipping,
        cod: productData.cod,
      },
      internationalShipping: {
        service: productData.internationalShippingService,
        processingTime: productData.internationalShippingTime,
        freeShipping: productData.internationalFreeShipping,
        cod: productData.internationalCod,
      },
      returnAndExchange: {
        isEnabled: productData.returnExchange || false,
        details: productData.returnExchange
          ? {
              days: productData.returningDays,
              description: productData.returningDescription,
            }
          : {
              days: null,
              description: null,
            },
      },
    });

    try {
      const savedProduct = await product.save();
      return savedProduct;
    } catch (error) {
      console.error("Error saving product:", error);
      throw error;
    }
  }

  async getVendorProduct(userID) {
    try {
      const products = await Product.find({ createdBy: userID, active: true })
        .select(
          "title media description price quantity productLimit tags materials renewal expDate views createdAt"
        )
        .populate("media.images", "url default")
        .exec();

      const totalCount = await Product.countDocuments({
        createdBy: userID,
        active: true,
      });

      return { products, totalCount };
    } catch (error) {
      console.error("Error fetching products:", error);
      throw new Error("Failed to fetch products from the database");
    }
  }

  async getInactiveVendorProduct(userID) {
    try {
      const products = await Product.find({ createdBy: userID, active: false })
        .select(
          "title media description price quantity productLimit tags materials renewal expDate views createdAt"
        )
        .populate("media.images", "url default")
        .exec();

      const totalCount = await Product.countDocuments({
        createdBy: userID,
        active: false,
      });

      return { products, totalCount };
    } catch (error) {
      console.error("Error fetching products:", error);
      throw new Error("Failed to fetch products from the database");
    }
  }

  async getProductDetails(productId) {
    const product = await this.incrementProductViews(productId);
    if (!product) throw new Error("Product not found");

    if (!product.active) throw new Error("Product is inactive");

    const validEngagement = await this.getValidEngagement(productId);

    let campaignResponse = {
      status: false,
      details: null,
    };

    if (validEngagement.status) {
      await this.incrementCampaignViews(validEngagement.engagement.campaignId);

      const campaignDetails = await this.getCampaignDetails(
        validEngagement.engagement.campaignId
      );

      if (campaignDetails) {
        campaignResponse = {
          status: true,
          details: {
            saleType: campaignDetails.saleType,
            title: campaignDetails.title,
            description: campaignDetails.description,
            startTime: campaignDetails.startTime,
            expiryTime: campaignDetails.expiryTime,
            image: campaignDetails.image,
            isActive: campaignDetails.isActive,
            discountPercentage: campaignDetails.discountPercentage,
            createdAt: campaignDetails.createdAt,
          },
        };
      }
    }

    const shop = await this.getShopDetails(product.createdBy);

    return {
      product: {
        title: product.title,
        media: product.media,
        video: product.video,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
        productLimit: product.productLimit,
        brand: product.brand,
        weight: product.weight,
        dimension: product.dimension,
        sku: product.sku,
        colors: product.colors,
        size: product.size,
        tags: product.tags,
        materials: product.materials,
        shipping: product.shipping,
        internationalShipping: product.internationalShipping,
        returnAndExchange: product.returnAndExchange,
        createdAt: product.createdAt,
        isActive: product.isActive,
      },
      shop: {
        shopName: shop.shopName,
        ownerName: shop.ownerName,
        shopLogo: shop.shopLogo,
        shopDescription: shop.shopDescription,
        createdDate: shop.createdDate,
      },
      campaign: campaignResponse,
      engagement: validEngagement || null,
    };
  }

  async incrementProductViews(productId) {
    return await Product.findByIdAndUpdate(
      productId,
      { $inc: { views: 1 } },
      { new: true }
    ).lean();
  }

  async incrementCampaignViews(campaignId) {
    return await Campaign.findByIdAndUpdate(
      campaignId,
      { $inc: { totalVisits: 1 } },
      { new: true }
    ).lean();
  }

  async getShopDetails(userId) {
    const shop = await Shop.findOne({ userId }).lean();
    if (!shop) throw new Error("Shop not found for the product owner");
    return shop;
  }

  async getValidEngagement(productId) {
    const currentTime = new Date();
    const engagement = await Engagement.findOne({
      productId,
      expiryTime: { $gt: currentTime },
    }).lean();

    if (!engagement || engagement.expiryTime <= currentTime) {
      return { engagement: null, status: false };
    }

    return { engagement, status: true };
  }

  async getCampaignDetails(campaignId) {
    const campaign = await Campaign.findById(campaignId).lean();

    return campaign;
  }

  async getProductCostingDetails(productRequests) {
    const now = new Date();
    const productIds = productRequests.map((req) => req.productId);

    const products = await Product.find({
      _id: { $in: productIds },
      active: true,
    }).select(
      "title media price productLimit brand shipping internationalShipping"
    );

    const engagements = await Engagement.find({
      productId: { $in: productIds },
      expiryTime: { $gt: now },
    }).populate("campaignId");

    const results = productRequests.map((request) => {
      const product = products.find(
        (p) => p._id.toString() === request.productId.toString()
      );

      if (!product) {
        return { productId: request.productId, error: "Product not found" };
      }

      if (request.quantity > product.productLimit) {
        return {
          productId: request.productId,
          error: `Requested quantity exceeds the product limit of ${product.productLimit}`,
        };
      }

      const engagement = engagements.find(
        (e) => e.productId.toString() === product._id.toString()
      );

      let campaignDetails = null;
      let totalAmount = product.price * request.quantity;
      let discountedAmount = totalAmount;
      let offeredCost = product.price;
      let campaignStatus = false;
      let freeShipping =
        product.shipping.freeShipping ||
        product.internationalShipping.freeShipping;

      if (engagement) {
        const campaign = engagement.campaignId;
        const isValidCampaign = campaign.isActive && campaign.expiryTime > now;

        if (isValidCampaign) {
          const discount = campaign.discountPercentage || 0;
          const discountAmount = (totalAmount * discount) / 100;

          discountedAmount = totalAmount - discountAmount;
          offeredCost = product.price - (product.price * discount) / 100;

          campaignDetails = {
            saleType: campaign.saleType,
            discountPercentage: discount,
            offeredCost: offeredCost.toFixed(2),
          };
          campaignStatus = true;

          if (campaign.saleType === "FREESHIPPING") {
            freeShipping = true;
          }
        }
      }

      return {
        productId: product._id,
        title: product.title,
        media: product.media.images.find((img) => img.default),
        price: product.price,
        productLimit: product.productLimit,
        requestedQuantity: request.quantity,
        totalAmount: totalAmount.toFixed(2),
        discountedAmount: discountedAmount.toFixed(2),
        offeredCost: campaignStatus
          ? offeredCost.toFixed(2)
          : product.price.toFixed(2),
        campaignDetails,
        campaignStatus,
        freeShipping,
      };
    });

    return results;
  }
}

module.exports = new ProductService();
