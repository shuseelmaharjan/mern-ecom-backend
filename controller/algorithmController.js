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
}

module.exports = new AlgorithmController();
