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
}

module.exports = new ProductController();
