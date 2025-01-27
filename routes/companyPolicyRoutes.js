const express = require("express");
const router = express.Router();
const PolicyController = require("../controller/policyController");
const { verifyAdmin } = require("../middleware/authJWT");

router.post(
  "/v1/create-site-policy",
  verifyAdmin,
  PolicyController.createPolicy
);

router.get("/v1/get-site-policy", PolicyController.getPolicies);

router.put(
  "/v1/update-site-policy/:policyId",
  verifyAdmin,
  PolicyController.updatePolicy
);

router.post(
  "/v1/create-shipping-policy",
  verifyAdmin,
  PolicyController.createShipping
);

router.get("/v1/get-shipping-policy", PolicyController.getShipping);

router.put(
  "/v1/deactivate-shipping-policy/:policyId",
  verifyAdmin,
  PolicyController.deactivateShippingPolicy
);

router.put(
  "/v1/update-shipping-policy/:policyId",
  verifyAdmin,
  PolicyController.updateShippingPolicy
);

router.post(
  "/v1/create-return-policy",
  verifyAdmin,
  PolicyController.createReturnPolicy
);

router.get("/v1/get-return-policy", PolicyController.getReturnPolicies);

router.put(
  "/v1/update-return-policy/:policyId",
  verifyAdmin,
  PolicyController.updateReturnPolicy
);

module.exports = router;
