const express = require("express");
const OrderController = require("../controller/orderController");

const router = express.Router();

// Route to create an order
router.post("/v1/create-order", OrderController.createOrder);
router.get("/v1/shop-orders/:orderStatus/:date", OrderController.getOrders);
router.get("/v1/order-details/:id", OrderController.getOrderDetails);
router.put("/v1/place-order/:orderId", OrderController.placeOrder);
router.put("/v1/delivered-order/:orderId", OrderController.deliveredOrder);

module.exports = router;
