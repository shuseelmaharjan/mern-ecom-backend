const { Campaign } = require("../models/campaign");
const Engagement = require("../models/engagement");
const Product = require("../models/product");
const { Category } = require("../models/categories");
const { Shop } = require("../models/shop");

class AlgorithmService {
  async getFlashSaleProducts() {
    try {
      const flashSaleCampaigns = await Campaign.find({
        isActive: true,
        priority: "HOME",
        saleType: "SALE",
      }).select(
        "_id title startTime expiryTime image poster discountPercentage"
      );

      if (flashSaleCampaigns.length === 0) {
        throw new Error("No active FLASHSALE campaigns found");
      }

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

      const campaign = flashSaleCampaigns[0];

      const productsList = products.map((product) => {
        const productEngagement = engagedProducts.find(
          (engagement) =>
            engagement.productId.toString() === product._id.toString()
        );

        const defaultImage = product.media?.images.find(
          (image) => image.default
        );
        const secondImage = product.media?.images[1];

        return {
          product: {
            id: product._id,
            title: product.title,
            defaultImage: defaultImage ? defaultImage.url : null,
            secondImage: secondImage ? secondImage.url : null,
            price: product.price,
            quantity: product.quantity,
            brand: product.brand,
            discountPercentage: campaign.discountPercentage,
          },
        };
      });

      return {
        campaign: {
          _id: campaign._id,
          title: campaign.title,
          startTime: campaign.startTime,
          expiryTime: campaign.expiryTime,
          image: campaign.image,
          poster: campaign.poster,
          discountPercentage: campaign.discountPercentage,
        },
        products: productsList,
      };
    } catch (error) {
      throw error;
    }
  }

  async getFreeShippingProducts() {
    try {
      const freeShippingCampaign = await Campaign.find({
        isActive: true,
        priority: "HOME",
        saleType: "FREESHIPPING",
      }).select(
        "_id title startTime expiryTime image poster discountPercentage"
      );

      if (freeShippingCampaign.length === 0) {
        throw new Error("No active Free Shipping campaigns found");
      }

      const campaignIds = freeShippingCampaign.map((campaign) => campaign._id);
      const engagedProducts = await Engagement.find({
        campaignId: { $in: campaignIds },
      }).select("productId campaignId");

      if (engagedProducts.length === 0) {
        throw new Error("No products found for Free Shipping campaigns");
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

      const campaign = freeShippingCampaign[0];

      const productsList = products.map((product) => {
        const productEngagement = engagedProducts.find(
          (engagement) =>
            engagement.productId.toString() === product._id.toString()
        );

        const defaultImage = product.media?.images.find(
          (image) => image.default
        );
        const secondImage = product.media?.images[1];

        return {
          product: {
            id: product._id,
            title: product.title,
            defaultImage: defaultImage ? defaultImage.url : null,
            secondImage: secondImage ? secondImage.url : null,
            price: product.price,
            quantity: product.quantity,
            brand: product.brand,
            discountPercentage: campaign.discountPercentage,
          },
        };
      });

      return {
        campaign: {
          _id: campaign._id,
          title: campaign.title,
          startTime: campaign.startTime,
          expiryTime: campaign.expiryTime,
          image: campaign.image,
          poster: campaign.poster,
        },
        products: productsList,
      };
    } catch (error) {
      throw error;
    }
  }

  async getFestivalProducts() {
    try {
      const festivalSaleCampaign = await Campaign.find({
        isActive: true,
        priority: "HOME",
        saleType: "FESTIVAL",
      }).select(
        "_id title startTime expiryTime image poster discountPercentage"
      );

      if (festivalSaleCampaign.length === 0) {
        throw new Error("No active Festival campaigns found");
      }

      const campaignIds = festivalSaleCampaign.map((campaign) => campaign._id);
      const engagedProducts = await Engagement.find({
        campaignId: { $in: campaignIds },
      }).select("productId campaignId");

      if (engagedProducts.length === 0) {
        throw new Error("No products found for Festival campaigns");
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

      const campaign = festivalSaleCampaign[0];

      const productsList = products.map((product) => {
        const productEngagement = engagedProducts.find(
          (engagement) =>
            engagement.productId.toString() === product._id.toString()
        );

        const defaultImage = product.media?.images.find(
          (image) => image.default
        );
        const secondImage = product.media?.images[1];

        return {
          product: {
            id: product._id,
            title: product.title,
            defaultImage: defaultImage ? defaultImage.url : null,
            secondImage: secondImage ? secondImage.url : null,
            price: product.price,
            quantity: product.quantity,
            brand: product.brand,
            discountPercentage: campaign.discountPercentage,
          },
        };
      });

      return {
        campaign: {
          _id: campaign._id,
          title: campaign.title,
          startTime: campaign.startTime,
          expiryTime: campaign.expiryTime,
          image: campaign.image,
          poster: campaign.poster,
          discountPercentage: campaign.discountPercentage,
        },
        products: productsList,
      };
    } catch (error) {
      throw error;
    }
  }

  async getFypService({ limit = 20, skip = 0 }) {
    const products = await Product.find({ isActive: true })
      .sort({ createdAt: -1, views: -1 })
      .skip(skip)
      .limit(limit)
      .select("title media price brand views variations");

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

      // Collect default images from variations
      let variationImages = [];
      const defaultVariations = product.variations.filter(
        (variation) => variation.isDefault
      );
      defaultVariations.forEach((variation) => {
        if (variation.media && variation.media.images) {
          variationImages.push(...variation.media.images);
        }
      });

      // Collect primary product images
      let productImages = product.media?.images || [];

      // Combine and deduplicate images
      const allImages = [...new Set([...productImages, ...variationImages])];

      recommendedProducts.push({
        productId: product._id,
        title: product.title,
        media: allImages.slice(0, 2),
        price: product.price,
        brand: product.brand || null,
        views: product.views,
        campaign: campaignDetails,
      });
    }

    return recommendedProducts;
  }

  //related content service 3
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

  //get category items service 4
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

  //get filter at category servic 5
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

  //get subcategories items service 6
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

  //get filter at subcategory service 7
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

  //get grandcategory items service 8
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

  //get filter at grandcategory service 9
  async getFilteredProductsByGrandCategory(
    grandCategoryId,
    filters,
    page = 1,
    limit = 2
  ) {
    try {
      const skip = (page - 1) * limit;

      // Initialize the filter criteria
      const filterCriteria = {
        categoryModel: "GrandCategory",
        category: grandCategoryId,
        active: true,
      };

      // Apply additional filters
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

      // Fetch filtered products
      const products = await Product.find(filterCriteria)
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

        const engagement = await Engagement.findOne({ productId: product._id });

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
      throw new Error(
        "Error fetching filtered products by grand category: " + error.message
      );
    }
  }

  //filter attributes return for category service 10
  async getCategoryAttributes(categoryId) {
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

      const products = await Product.find(filterCriteria);

      const brands = [
        ...new Set(products.map((product) => product.brand).filter(Boolean)),
      ];
      const colors = [
        ...new Map(
          products
            .flatMap((product) => product.colors?.details || [])
            .map((color) => [color.name + color.code, color])
        ).values(),
      ];
      const sizes = [
        ...new Set(products.flatMap((product) => product.size || [])),
      ];
      const tags = [
        ...new Set(products.flatMap((product) => product.tags || [])),
      ];
      const materials = [
        ...new Set(products.flatMap((product) => product.materials || [])),
      ];

      return { brands, colors, sizes, tags, materials };
    } catch (error) {
      console.error("Error fetching category attributes:", error);
      throw new Error("Error fetching category attributes");
    }
  }

  async getProductsByActiveCampaign(params) {
    const {
      campaignId,
      limit = 5,
      offset = 0,
      minPrice,
      maxPrice,
      brand,
      colors,
      size,
      sortBy,
    } = params;

    const campaign = await Campaign.findById(campaignId);
    if (!campaign || !campaign.isActive) {
      throw new Error("Invalid or inactive campaign");
    }

    const query = {
      active: true,
      "campaign._id": campaignId,
    };

    if (minPrice) query.price = { ...query.price, $gte: Number(minPrice) };
    if (maxPrice) query.price = { ...query.price, $lte: Number(maxPrice) };
    if (brand) query.brand = brand;
    if (colors) query["colors.details.name"] = { $in: colors.split(",") };
    if (size) query.size = { $in: size.split(",") };

    let sortOption = {};
    if (sortBy === "high_price") sortOption.price = -1;
    else if (sortBy === "low_price") sortOption.price = 1;
    else if (sortBy === "new_arrivals") sortOption.createdAt = -1;
    else if (sortBy === "most_popular") sortOption.views = -1;

    const products = await Product.find(query)
      .sort(sortOption)
      .skip(Number(offset))
      .limit(Number(limit));

    return products;
  }

  async getProductInformation(productId) {
    const product = await Product.findById(productId)
      .populate("category")
      .populate("createdBy")
      .populate("shipping")
      .populate("returnPolicy");

    if (!product || !product.isActive) {
      throw new Error("Product not found or is not active");
    }

    const shop = await Shop.findOne({
      userId: product.createdBy._id,
      isActive: true,
    });

    if (!shop) {
      throw new Error("Shop not found or is not active");
    }

    // Check for engagement in campaigns
    const engagement = await Engagement.findOne({
      productId: product._id,
      expiryTime: { $gt: new Date() },
    }).populate("campaignId");

    const result = {
      product: {
        title: product.title,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
        productLimit: product.productLimit,
        brand: product.brand,
        weight: product.weight,
        shape: product.shape,
        hasDimension: product.hasDimension,
        productHeight: product.productHeight,
        productWidth: product.productWidth,
        hasColor: product.hasColor,
        color: product.color,
        material: product.material,
        hasSize: product.hasSize,
        size: product.size,
        customOrder: product.customOrder,
        defaultShipping: product.defaultShipping,
        shipping: product.shipping,
        defaultReturnPolicy: product.defaultReturnPolicy,
        returnPolicy: product.returnPolicy,
        haveVariations: product.haveVariations,
        variations: product.variations,
        sales: product.sales,
        rating: product.rating,
        reviews: product.reviews,
      },
      shop: {
        shopName: shop.shopName,
        shopLogo: shop.shopLogo,
        shopDescription: shop.shopDescription,
      },
    };

    if (engagement && engagement.campaignId.isActive) {
      result.campaign = {
        saleType: engagement.campaignId.saleType,
        title: engagement.campaignId.title,
        description: engagement.campaignId.description,
        startTime: engagement.campaignId.startTime,
        expiryTime: engagement.campaignId.expiryTime,
        image: engagement.campaignId.image,
        banner: engagement.campaignId.banner,
        poster: engagement.campaignId.poster,
        discountPercentage: engagement.campaignId.discountPercentage,
      };
    }

    return result;
  }
}

module.exports = new AlgorithmService();
