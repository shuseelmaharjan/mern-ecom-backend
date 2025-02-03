const algorithmService = require("../services/algorithmService");

class AlgorithmController {
  //service 1
  async getFlashSaleProducts(req, res) {
    try {
      const products = await algorithmService.getFlashSaleProducts();
      res.status(200).json({ products });
    } catch (error) {
      console.error("Error fetching products for FLASHSALE:", error);
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  }

  //service 2
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

  //service 3
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

  //service 4
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

  //service 5
  async getFilteredProductsByCategory(req, res) {
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

  //service 6
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

  //service 7
  async getFilteredProductsBySubCategory(req, res) {
    const { subCategoryId } = req.params;
    const { page = 1, limit = 2 } = req.query;
    const filters = req.query;

    try {
      const filteredProducts =
        await algorithmService.getFilteredProductsBySubCategory(
          subCategoryId,
          filters,
          parseInt(page),
          parseInt(limit)
        );
      res.json(filteredProducts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  //service 8
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

  //service 9
  async getFilteredProductsByGrandCategory(req, res) {
    const { grandCategoryId } = req.params;
    const { page = 1, limit = 2 } = req.query;
    const filters = req.query;

    try {
      const filteredProducts =
        await algorithmService.getFilteredProductsByGrandCategory(
          grandCategoryId,
          filters,
          parseInt(page),
          parseInt(limit)
        );
      res.json(filteredProducts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  //service 10
  async getCategoryAttributes(req, res) {
    try {
      const { categoryId } = req.params;

      const attributes = await algorithmService.getCategoryAttributes(
        categoryId
      );

      res.status(200).json({
        brands: attributes.brands,
        colors: attributes.colors.map((color) => ({
          name: color.name,
          code: color.code,
        })),
        sizes: attributes.sizes,
        tags: attributes.tags,
        materials: attributes.materials,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getFreeShippingProducts(req, res) {
    try {
      const products = await algorithmService.getFreeShippingProducts();
      res.status(200).json({ products });
    } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  }

  async getFestivalProducts(req, res) {
    try {
      const products = await algorithmService.getFestivalProducts();
      res.status(200).json({ products });
    } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  }

  async suggestProducts(req, res) {
    try {
      const params = req.query;
      const products = await algorithmService.getProductsByActiveCampaign(
        params
      );
      return res.status(200).json({ success: true, data: products });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async getProductInformation(req, res) {
    try {
      const { productId } = req.params;
      const productDetails = await algorithmService.getProductInformation(
        productId
      );
      res.status(200).json(productDetails);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getCartTotalItemsDetails(req, res) {
    const { products } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res
        .status(400)
        .json({ message: "Missing or invalid products parameter" });
    }

    try {
      const results = await algorithmService.calculateTotalPrice(products);
      return res.json(results);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new AlgorithmController();
