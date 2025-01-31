const shippingMethodService = require("../services/shippingMethodService");
const GetUserId = require("../helper/getUserId");

class ShippingMethodController {
  async createShippingMethod(req, res) {
    try {
      const getUserId = new GetUserId(req);
      const userId = await getUserId.getUserId();
      console.log(userId);
      await shippingMethodService.createLogisticService(req.body, userId);
      return res.status(201).json({
        success: true,
        message: "Shipping method created successfully",
      });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async getLogisticServices(req, res) {
    try {
      const getUserId = new GetUserId(req);
      const userId = await getUserId.getUserId();
      const shippingMethods = await shippingMethodService.getLogisticServices(
        userId
      );
      return res.status(200).json(shippingMethods);
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async updateLogisticService(req, res) {
    try {
      const getUserId = new GetUserId(req);
      const userId = await getUserId.getUserId();
      const shippingMethodId = req.params.id;
      const updatedShippingMethod =
        await shippingMethodService.updateLogisticService(
          userId,
          shippingMethodId
        );
      return res.status(200).json(updatedShippingMethod);
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = new ShippingMethodController();
