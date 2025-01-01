const express = require("express");
const ShippingController = require("../controller/shippingController");
const router = express.Router();
const { verifyAccessToken } = require("../middleware/authJWT");

// @CRUL -X POST
// @-H "Authorization: Bearer accesstoken"
// @-H "Content-Type: application/json"
// @-d - '{
//     "fullName": "John Doe",
//     "addressLine1": "123 Main St",
//     "addressLine2": "Apt 4B",
//     "city": "New York",
//     "state": "NY",
//     "postalCode": "10001",
//     "country": "USA",
//     "isDefault": true
//   }'
router
  .route("/v1/add-shipping-address")
  .post(verifyAccessToken, ShippingController.addShippingAddress);

// @CRUL -X GET
// @-H "Authorization: Bearer accesstoken"
// @-H "Content-Type: application/json"
router
  .route("/v1/get-shipping-addresses")
  .get(verifyAccessToken, ShippingController.getShippingAddress);

// @CRUL -X PUT
// @-H "Authorization: Bearer accesstoken"
// @-H "Content-Type: application/json"
router
  .route("/v1/update-shipping-address/:addressId")
  .put(verifyAccessToken, ShippingController.updateShippingAddress);

// @CRUL -X DELETE
// @-H "Authorization: Bearer accesstoken"
// @-H "Content-Type: application/json"
router
  .route("/v1/delete-shipping-address/:addressId")
  .delete(verifyAccessToken, ShippingController.deleteShippingAddress);

module.exports = router;
