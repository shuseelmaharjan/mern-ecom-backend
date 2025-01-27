const express = require("express");
const router = express.Router();
const shopController = require("../controller/shopController");
const { verifyAccessToken, verifyVendor } = require("../middleware/authJWT");
const uploadMiddleware = require("./../middleware/uploadShopLogo");

// Create a new shop
router.post("/v1/create-shop", verifyAccessToken, shopController.create);
router.get(
  "/v1/my-shop-details",
  verifyAccessToken,
  shopController.myShopDetails
);

router.put(
  "/v1/:shopId/logo",
  uploadMiddleware.single("shopLogo"),
  verifyAccessToken,
  shopController.updateShopLogo
);

router.put(
  "/v1/:shopId/description",
  verifyAccessToken,
  shopController.updateDescription
);

router.post(
  "/v1/:shopId/add-shipping-policy",
  verifyAccessToken,
  shopController.createShopPolicy
);

router.get("/v1/:shopId/shipping-policies", shopController.getShopPolicies);
router.put(
  "/v1/deactivate-shop-shipping-policy/:policyId",
  verifyAccessToken,
  shopController.deactivateShopShippingPolicy
);

router.post(
  "/v1/create-shop-return-policy/:shopId",
  verifyAccessToken,
  shopController.createShopReturnPolicy
);

router.get(
  "/v1/get-shop-return-policy/:shopId",
  shopController.getShopReturnPolicies
);

router.put(
  "/v1/deactivate-shop-return-policy/:policyId",
  verifyAccessToken,
  shopController.deactivateShopReturnPolicy
);
// Deactivate a shop (set isActive to false)
router.put(
  "/v1/deactivate-shop/:id",
  verifyAccessToken,
  verifyVendor,
  shopController.deactivate
);

module.exports = router;
