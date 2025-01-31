const express = require("express");
const shippingMethodController = require("../controller/shippingMethodController");
const router = express.Router();

router.post(
  "/v1/create-logistic-company",
  shippingMethodController.createShippingMethod
);
router.get(
  "/v1/shipping-methods",
  shippingMethodController.getLogisticServices
);
router.put(
  "/v1/update-shipping-method/:id",
  shippingMethodController.updateLogisticService
);

module.exports = router;
