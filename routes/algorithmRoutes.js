const express = require("express");
const algorithmController = require("../controller/algorithmController");

const router = express.Router();

// Define the route for getting flash sale products
router.get("/v1/flashsale-products", algorithmController.getFlashSaleProducts);
router.get("/v1/foryoupage", algorithmController.getFypRecommendations);
router.get(
  "/v1/related-products/:productId",
  algorithmController.getRelatedProducts
);
router.get(
  "/v1/grandcategory/:grandCategoryId",
  algorithmController.getProductsByGrandCategory
);

module.exports = router;
