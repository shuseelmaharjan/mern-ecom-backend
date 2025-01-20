const algorithmService = require("../services/algorithmService");

class AlgorithmController {
  async getFlashSaleProducts(req, res) {
    try {
      const products = await algorithmService.getFlashSaleProducts();
      res.status(200).json({ products });
    } catch (error) {
      console.error("Error fetching products for FLASHSALE:", error);
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  }

  async getFypRecommendations(req, res) {
    try {
      const { limit, skip } = req.query;

      const parsedLimit = parseInt(limit) || 20;
      const parsedSkip = parseInt(skip) || 0;

      const recommendations = await algorithmService.getFypService({
        limit: parsedLimit,
        skip: parsedSkip,
      });

      res.status(200).json({
        success: true,
        data: recommendations,
      });
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  }

  async getRelatedProducts(req, res) {
    try {
      const { productId } = req.params;
      const { limit = 20 } = req.query;

      const relatedProducts = await algorithmService.getRelatedProducts(
        productId,
        parseInt(limit)
      );

      res.status(200).json({
        success: true,
        data: relatedProducts,
      });
    } catch (error) {
      console.error("Error fetching related products:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  }

  async getProductsByGrandCategory(req, res) {
    try {
      const grandCategoryId = req.params.grandCategoryId;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 2;

      const products = await algorithmService.getProductsByGrandCategory(
        grandCategoryId,
        page,
        limit
      );

      res.status(200).json({
        success: true,
        data: products,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new AlgorithmController();
