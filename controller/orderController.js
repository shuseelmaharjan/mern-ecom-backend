const OrderService = require("../services/orderService");
const GetUserId = require("../helper/getUserId");

class OrderController {
  static async createOrder(req, res) {
    try {
      const getUserId = new GetUserId(req);
      const userId = await getUserId.getUserId();

      const order = await OrderService.createOrder(req.body, userId);

      return res.status(201).json({
        success: true,
        message: "Order created successfully",
        data: order,
      });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getOrders(req, res) {
    try {
      const getUserId = new GetUserId(req);
      const vendorId = await getUserId.getUserId();
      const { orderStatus } = req.params;
      const { date } = req.params;

      const orders = await OrderService.getOrdersByShop(
        vendorId,
        orderStatus,
        date
      );
      res.status(200).json(orders);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getOrderDetails(req, res) {
    try {
      const orderId = req.params.id;
      const orderDetails = await OrderService.getOrderDetails(orderId);
      res.status(200).json(orderDetails);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async placeOrder(req, res) {
    try {
      const { orderId } = req.params;
      const { shippingMethod, trackingNumber, logisticCost } = req.body;
      console.log("Request Body: ", req.body);

      console.log("Order ID: ", orderId);
      console.log("Shipping Method: ", shippingMethod);
      console.log("Tracking Number: ", trackingNumber);
      console.log("Logistic Cost: ", logisticCost);

      const updatedOrder = await OrderService.placeOrder(
        orderId,
        shippingMethod,
        trackingNumber,
        logisticCost
      );

      res.status(200).json(updatedOrder);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async deliveredOrder(req, res) {
    try {
      const { orderId } = req.params;
      const updatedOrder = await OrderService.deliveredOrder(orderId);
      res.status(200).json(updatedOrder);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = OrderController;
