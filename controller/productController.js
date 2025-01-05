const ProductService = require("../services/productService");
const jwt = require("jsonwebtoken");

class ProductController {
  constructor() {
    this.productService = new ProductService();
  }

  createProduct = async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const token = authHeader.split(" ")[1];
      let userId;
      try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        userId = decodedToken.UserInfo.id;
      } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
      }

      const files = req.files;
      const productData = { ...req.body, files, createdBy: userId };

      const savedProduct = await this.productService.createProduct(productData);

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
  };

  getVendoProduct = async (req, res) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const token = authHeader.split(" ")[1];
      let userId;

      try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        userId = decodedToken.UserInfo.id;
      } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
      }

      const products = await this.productService.getVendorProduct(userId);

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
  };
}

module.exports = new ProductController();
