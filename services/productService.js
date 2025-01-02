const Product = require("../models/product");

class ProductService {
  async createProduct(productData) {
    const { files, createdBy } = productData;

    const media = {
      images: files.images
        ? files.images.map((file) => ({ url: file.path }))
        : [],
    };

    const product = new Product({
      ...productData,
      media,
      thumbnail: files.thumbnail ? files.thumbnail[0].path : undefined,
      video: files.video ? files.video[0].path : undefined,
      dimension: productData.dimension
        ? JSON.parse(productData.dimension)
        : undefined,
      colors: productData.colors ? JSON.parse(productData.colors) : [],
      size: productData.size ? JSON.parse(productData.size) : [],
      tags: productData.tags ? JSON.parse(productData.tags) : [],
      materials: productData.materials ? JSON.parse(productData.materials) : [],
      shipping: productData.shipping
        ? JSON.parse(productData.shipping)
        : undefined,
      internationalShipping: productData.internationalShipping
        ? JSON.parse(productData.internationalShipping)
        : undefined,
      returnAndExchange: productData.returnAndExchange
        ? JSON.parse(productData.returnAndExchange)
        : [],
    });

    return await product.save();
  }
}

module.exports = ProductService;
