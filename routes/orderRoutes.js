const express = require("express");
const OrderController = require("../controller/orderController");

const router = express.Router();

// Route to create an order
router.post("/v1/create-order", OrderController.createOrder);
router.get("/v1/shop-orders/:orderStatus/:date", OrderController.getOrders);

module.exports = router;
