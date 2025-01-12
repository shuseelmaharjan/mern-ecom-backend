const express = require("express");
const shippingController = require("../controller/shipingController");
const router = express.Router();
const { verifyAccessToken } = require("../middleware/authJWT");

router.get(
  "/v1/get-my-shipping-address",
  verifyAccessToken,
  shippingController.getShippingData
);

router.post(
  "/v1/useraddress/add",
  verifyAccessToken,
  shippingController.addShippingAddress
);

router.put(
  "/v1/shippingaddress/update/:shippingAddressId",
  verifyAccessToken,
  shippingController.updateShippingAddress
);

router.get(
  "/v1/shipping-address/:shippingAddressId",
  verifyAccessToken,
  shippingController.getShippingAddress
);

module.exports = router;
