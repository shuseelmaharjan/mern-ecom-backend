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

module.exports = router;
