const express = require("express");
const router = express.Router();
const productController = require("../controller/productController");
const { verifyAccessToken } = require("./../middleware/authJWT");

router.post(
  "/v1/create-product",
  verifyAccessToken,
  productController.createProduct
);

module.exports = router;
