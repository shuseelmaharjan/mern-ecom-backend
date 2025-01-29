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
router.get(
  "/v2/shipping-policies",
  verifyAccessToken,
  shopController.getShopPoliciesByVendor
);
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

router.get(
  "/v1/get-shop-return-policy",
  verifyAccessToken,
  shopController.getShopReturnPoliciesByVendor
);

router.put(
  "/v1/deactivate-shop-return-policy/:policyId",
  verifyAccessToken,
  shopController.deactivateShopReturnPolicy
);
router.put(
  "/v1/deactivate-shop/:id",
  verifyAccessToken,
  shopController.deactivate
);

router.post(
  "/v2/create-shop-return-policy",
  verifyAccessToken,
  shopController.addReturnPolicyWithUserId
);

module.exports = router;
