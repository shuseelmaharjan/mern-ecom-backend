const express = require("express");
const router = express.Router();
const productController = require("../controller/productController");
const { verifyAccessToken } = require("./../middleware/authJWT");
const uploadFiles = require("../middleware/product");

router.post(
  "/v1/create-product",
  verifyAccessToken,
  uploadFiles,
  productController.createProduct
);

router.get(
  "/v1/vendor-product",
  verifyAccessToken,
  productController.getVendoProduct
);

router.get(
  "/v1/inactive-vendor-product",
  verifyAccessToken,
  productController.getInactiveVendoProduct
);

router.get("/v1/product/:productId", productController.getProductDetails);

router.get(
  "/v1/product-category-details/:productId",
  productController.getCategoryHierarchy
);

router.post("/v1/products-costing", productController.getProductsCosting);

router.get("/v1/todays-deal", productController.todaysDealProducts);

module.exports = router;
