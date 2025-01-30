const express = require("express");
const router = express.Router();
const productController = require("../controller/productController");
const { verifyAccessToken } = require("./../middleware/authJWT");
const uploadFiles = require("../middleware/uploadFiles");
const FileController = require("../controller/fileController");

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

router.put(
  "/v1/update-product/:id",
  verifyAccessToken,
  productController.updateProductDetails
);

router.get(
  "/v1/get-product-variation/:id",
  verifyAccessToken,
  productController.getProductVariations
);

router.put(
  "/v1/products/:productId/variations",
  uploadFiles,
  FileController.updateProduct
);

router.put(
  "/v1/products/:productId/product-variations",
  uploadFiles,
  FileController.updateProduct
);

router.put(
  "/v1/products/:productId/variations/:variationId",
  uploadFiles,
  FileController.updateVariation
);

router.get(
  "/v1/products/:productId/variations/:variationId",
  FileController.getVariation
);

router.delete(
  "/v1/products/:productId/variations/:variationIds",
  verifyAccessToken,
  productController.removeProductVariation
);

router.put(
  "/v1/update-has-variations/:id",
  verifyAccessToken,
  productController.updateHaveVariations
);

router.get(
  "/v1/get-product-policy/:productId",
  verifyAccessToken,
  productController.productPolicy
);

router.put(
  "/v1/update-product-policy/:productId",
  verifyAccessToken,
  productController.updateProductPolicy
);

router.put(
  "/v1/update-product-shipping-policy/:productId",
  verifyAccessToken,
  productController.updateProductShippingPolicy
);

router.get(
  "/v1/get-vendor-products/:sort/:isActive/:isDraft",
  verifyAccessToken,
  productController.getVendorProducts
);

module.exports = router;
