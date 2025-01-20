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

  async getProductsBySubCategory(req, res) {
    const { subCategoryId } = req.params;
    const { page = 1, limit = 2 } = req.query;

    try {
      const products = await algorithmService.getProductsBySubCategory(
        subCategoryId,
        page,
        limit
      );
      return res.json({
        success: true,
        data: products,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getProductsByGrandCategory(req, res) {
    const { grandCategoryId } = req.params;
    const { page = 1, limit = 2 } = req.query;

    try {
      const products = await algorithmService.getProductsByGrandCategory(
        grandCategoryId,
        page,
        limit
      );
      return res.json({
        success: true,
        data: products,
      });
    } catch (error) {
      console.error("Error in getProductsByGrandCategory:", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getProductsByCategory(req, res) {
    const { categoryId } = req.params;
    const { page = 1, limit = 2 } = req.query;

    try {
      const products = await algorithmService.getProductsByCategory(
        categoryId,
        parseInt(page),
        parseInt(limit)
      );
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getFilteredProducts(req, res) {
    const { categoryId } = req.params;
    const { page = 1, limit = 2 } = req.query;
    const filters = req.query;

    try {
      const filteredProducts =
        await algorithmService.getFilteredProductsByCategory(
          categoryId,
          filters,
          parseInt(page),
          parseInt(limit)
        );
      res.json(filteredProducts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new AlgorithmController();
