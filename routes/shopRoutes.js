const express = require("express");
const router = express.Router();
const shopController = require("../controller/shopController");
const { verifyAccessToken, verifyVendor } = require("../middleware/authJWT");

const upload = require("./../middleware/shopMiddlware");

// Create a new shop
router.post(
  "/v1/create-shop",
  upload.single("shopLogo"),
  verifyAccessToken,
  shopController.create
);

// Update an existing shop
router.put(
  "/v1/update-shop/:id",
  upload.single("shopLogo"),
  verifyAccessToken,
  verifyVendor,
  shopController.update
);

// Deactivate a shop (set isActive to false)
router.put(
  "/v1/deactivate-shop/:id",
  verifyAccessToken,
  verifyVendor,
  shopController.deactivate
);

router.get("/v1/myshop", verifyVendor, shopController.getShopDetails);

module.exports = router;
