const express = require("express");
const router = express.Router();
const productController = require("../controller/productController");
const { verifyAccessToken } = require("./../middleware/authJWT");
const product = require("../models/product");

router.post(
  "/v1/create-product",
  verifyAccessToken,
  productController.createProduct
);
router.get(
  "/v1/product-details/:id",
  verifyAccessToken,
  productController.getProductDetails
);

router.get(
  "/v1/get-dimensions/:id",
  verifyAccessToken,
  productController.getDimensions
);

router.put(
  "/v1/update-has-dimension/:id",
  verifyAccessToken,
  productController.updateHasDimension
);
router.put(
  "/v1/add-dimension/:id",
  verifyAccessToken,
  productController.addDimension
);

router.get(
  "/v1/get-colors/:id",
  verifyAccessToken,
  productController.getColors
);
router.put(
  "/v1/update-has-colors/:id",
  verifyAccessToken,
  productController.updateHasColor
);
router.put("/v1/add-color/:id", verifyAccessToken, productController.addColor);
router.put(
  "/v1/remove-color/:id",
  verifyAccessToken,
  productController.removeColor
);

router.get("/v1/get-size/:id", verifyAccessToken, productController.getSize);
router.put(
  "/v1/update-has-size/:id",
  verifyAccessToken,
  productController.updateHasSize
);
router.put("/v1/add-size/:id", verifyAccessToken, productController.addSize);
router.put(
  "/v1/remove-size/:id",
  verifyAccessToken,
  productController.removeSize
);

router.get("/v1/get-tags/:id", verifyAccessToken, productController.getTags);
router.put("/v1/add-tags/:id", verifyAccessToken, productController.addTags);
router.put(
  "/v1/remove-tags/:id",
  verifyAccessToken,
  productController.removeTags
);

module.exports = router;
