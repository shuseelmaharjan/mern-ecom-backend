const productService = require("../services/productService");
const GetUserId = require("../helper/getUserId");

class ProductController {
  async createProduct(req, res) {
    const getUserId = new GetUserId(req);
    const userId = await getUserId.getUserId();
    try {
      const product = req.body;
      const newProduct = await productService.createProduct(product, userId);
      res.status(201).json(newProduct);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = new ProductController();
