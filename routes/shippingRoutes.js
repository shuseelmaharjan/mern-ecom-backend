const express = require('express');
const ShippingController = require('../controller/shippingController');
const router = express.Router();
const verifyJWT = require('../middleware/verifyJWT');

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
router.route('/v1/add-shipping-address').post(verifyJWT, ShippingController.addShippingAddress);


// @CRUL -X GET
// @-H "Authorization: Bearer accesstoken" 
// @-H "Content-Type: application/json" 
router.route('/v1/get-shipping-addresses').get(verifyJWT, ShippingController.getShippingAddress);


// @CRUL -X PUT
// @-H "Authorization: Bearer accesstoken" 
// @-H "Content-Type: application/json" 
router.route('/v1/update-shipping-address/:addressId').put(verifyJWT, ShippingController.updateShippingAddress);



// @CRUL -X DELETE
// @-H "Authorization: Bearer accesstoken" 
// @-H "Content-Type: application/json" 
router.route('/v1/delete-shipping-address/:addressId').delete(verifyJWT, ShippingController.deleteShippingAddress);


module.exports = router;