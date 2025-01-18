const express = require("express");
const algorithmController = require("../controller/algorithmController");

const router = express.Router();

// Define the route for getting flash sale products
router.get("/v1/flashsale-products", algorithmController.getFlashSaleProducts);

module.exports = router;
