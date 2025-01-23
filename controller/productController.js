const productService = require("../services/productService");
const GetUserId = require("../helper/getUserId");

class ProductController {
  async createProduct(req, res) {
    try {
      const id = new GetUserId(req);
      const userId = await id.getUserId();

      const files = req.files;
      const productData = { ...req.body, files };

      const savedProduct = await productService.createProduct(
        productData,
        userId
      );

      res.status(201).json({
        message: "Product created successfully",
        product: savedProduct,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Failed to create product", error: error.message });
    }
  }

  async getVendoProduct(req, res) {
    try {
      const id = new GetUserId(req);
      const userId = await id.getUserId();

      const products = await productService.getVendorProduct(userId);

      if (!products || products.length === 0) {
        return res
          .status(404)
          .json({ message: "No products found for this user" });
      }

      return res.status(200).json({
        message: "Data fetched successfully",
        products,
      });
    } catch (error) {
      console.error("Error fetching vendor products:", error);
      return res.status(500).json({
        message: "Failed to fetch products",
        error: error.message,
      });
    }
  }

  async getInactiveVendoProduct(req, res) {
    try {
      const id = new GetUserId(req);
      const userId = await id.getUserId();

      const products = await productService.getInactiveVendorProduct(userId);

      if (!products || products.length === 0) {
        return res
          .status(404)
          .json({ message: "No products found for this user" });
      }

      return res.status(200).json({
        message: "Data fetched successfully",
        products,
      });
    } catch (error) {
      console.error("Error fetching vendor products:", error);
      return res.status(500).json({
        message: "Failed to fetch products",
        error: error.message,
      });
    }
  }

  async getProductDetails(req, res) {
    const { productId } = req.params;

    try {
      const product = await productService.getProductDetails(productId);
      res.status(200).json({
        success: true,
        message: "Product details fetched successfully",
        data: product,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message || "Unable to fetch product details",
      });
    }
  }

  async getCategoryHierarchy(req, res) {
    try {
      const { productId } = req.params;
      const data = await productService.getCategoryHierarchy(productId);
      return res.status(200).json({
        success: true,
        message: "Category details fetched successfully",
        data,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getProductsCosting(req, res) {
    try {
      const productRequests = req.body.products;
      if (!Array.isArray(req.body.products) || req.body.products.length === 0) {
        return res.status(400).json({
          error: "Invalid product data. Provide an array of product objects.",
        });
      }

      const results = await productService.getProductCostingDetails(
        productRequests
      );
      res.status(200).json({ results });
    } catch (error) {
      console.error("Error calculating product costs:", error);
      res
        .status(500)
        .json({ error: "An error occurred while calculating product costs." });
    }
  }

  async todaysDealProducts(req, res) {
    try {
      const products = await productService.getTodaysDeals();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch engaged products." });
    }
  }
}

module.exports = new ProductController();
