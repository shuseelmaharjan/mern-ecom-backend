const product = require("../models/product");
const Product = require("../models/product");

class ProductService {
  async createProduct(productData) {
    const { files, createdBy } = productData;
    console.log(productData);

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
      createdBy,
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
      const products = await Product.find({ createdBy: userID });
      return products;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw new Error("Failed to fetch products from the database");
    }
  }
}

module.exports = ProductService;
