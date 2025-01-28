const Product = require("../models/product");

class ProductService {
  async createProduct(product, userId) {
    const { title, category } = product;
    try {
      const newProduct = new Product({
        title,
        category,
        createdBy: userId,
      });
      await newProduct.save();
      return newProduct;
    } catch (err) {
      throw new Error(err);
    }
  }
}

module.exports = new ProductService();
