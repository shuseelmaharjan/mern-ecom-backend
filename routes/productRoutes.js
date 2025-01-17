const express = require("express");
const router = express.Router();
const productController = require("../controller/productController");
const { verifyVendor, verifyAccessToken } = require("./../middleware/authJWT");
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

module.exports = router;
