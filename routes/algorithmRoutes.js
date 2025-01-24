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
  "/v1/product-category/:categoryId",
  algorithmController.getProductsByCategory
);
router.get(
  "/v1/category-filter/:categoryId",
  algorithmController.getFilteredProductsByCategory
);

router.get(
  "/v1/product-subcategory/:subCategoryId",
  algorithmController.getProductsBySubCategory
);

router.get(
  "/v1/subcategory-filter/:subCategoryId",
  algorithmController.getFilteredProductsBySubCategory
);

router.get(
  "/v1/product-grandcategory/:grandCategoryId",
  algorithmController.getProductsByGrandCategory
);

router.get(
  "/v1/grandcategory-filter/:grandCategoryId",
  algorithmController.getFilteredProductsByCategory
);

router.get(
  "/v1/category/:categoryId/filter-attributes",
  algorithmController.getCategoryAttributes
);
router.get(
  "/v1/freeshipping-products",
  algorithmController.getFreeShippingProducts
);
router.get("/v1/festival-products", algorithmController.getFestivalProducts);

// GET http://localhost:5000/api/v1/campaign-suggestion?campaignId=<campaignId>&limit=5&offset=0&minPrice=100&maxPrice=500&sortBy=most_popular
router.get("/v1/campaign-suggestion", algorithmController.suggestProducts);

module.exports = router;
