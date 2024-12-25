const express = require('express');
const router = express.Router();
const shopController = require('../controller/shopController');
const { verifyAccessToken, verifyVendorRole } = require('../middleware/authVerifyUser');

// Create a new shop
router.post('/v1/create-shop', verifyAccessToken, shopController.create);

// Update an existing shop
router.put('/v1/update-shop/:id', verifyAccessToken, verifyVendorRole, shopController.update);

// Deactivate a shop (set isActive to false)
router.put('/v1/deactivate-shop/:id', verifyAccessToken, verifyVendorRole, shopController.deactivate);

module.exports = router;
