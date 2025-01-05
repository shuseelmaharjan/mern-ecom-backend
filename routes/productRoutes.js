const express = require("express");
const router = express.Router();
const productController = require("../controller/productController");
const { verifyVendor } = require("./../middleware/authJWT");
const uploadFiles = require("../middleware/product");

router.post(
  "/v1/create-product",
  verifyVendor,
  uploadFiles,
  productController.createProduct
);

router.get(
  "/v1/vendor-product",
  verifyVendor,
  productController.getVendoProduct
);

module.exports = router;
