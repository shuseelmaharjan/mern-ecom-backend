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

    // let colors = [];
    // if (productData.colors && Array.isArray(productData.colors)) {
    //   productData.colors.forEach((color) => {
    //     // Extract isEnabled and details if they exist
    //     const isEnabled = color.isEnabled || false;
    //     const details = [];

    //     if (color.details && Array.isArray(color.details)) {
    //       color.details.forEach((detail) => {
    //         if (detail.code || detail.name) {
    //           details.push({
    //             code: detail.code || null,
    //             name: detail.name || null,
    //           });
    //         }
    //       });
    //     }

    //     // Add to the colors array only if necessary
    //     colors.push({
    //       isEnabled,
    //       details,
    //     });
    //   });
    // }

    const size = Array.isArray(productData.size) ? productData.size : [];
    const tags = Array.isArray(productData.tags) ? productData.tags : [];
    const materials = Array.isArray(productData.materials)
      ? productData.materials
      : [];

    const product = new Product({
      ...productData,
      createdBy,
      thumbnail: files?.thumbnail ? files.thumbnail[0].path : undefined,
      video: files?.video ? files.video[0].path : undefined,
      dimension: productData.dimension
        ? JSON.parse(productData.dimension)
        : undefined,
      // colors,
      size,
      tags,
      materials,
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
      returnAndExchange: {
        isEnabled: productData.returnExchange || false,
        details: productData.returnExchange
          ? {
              days: productData.returningDays,
              description: productData.returningDescription,
            }
          : null,
      },
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
    });

    try {
      const savedProduct = await product.save();
      return savedProduct;
    } catch (error) {
      console.error("Error saving product:", error);
      throw error;
    }
  }
}

module.exports = ProductService;
