const ShippingMethod = require("../models/shippingMethod");
const User = require("../models/users");

class ShippingMethodService {
  async createLogisticService(data, userId) {
    try {
      const { name, shippingCompany } = data;
      const user = await User.findById(userId);
      if (!user) throw new Error("User not found");

      const shippingMethod = new ShippingMethod({
        name,
        shippingCompany,
        user: userId,
      });

      await shippingMethod.save();
      return shippingMethod;
    } catch (err) {
      throw err;
    }
  }

  async getLogisticServices(userId) {
    try {
      const shippingMethods = await ShippingMethod.find({
        user: userId,
        isActive: true,
      });
      return shippingMethods;
    } catch (err) {
      throw err;
    }
  }

  async updateLogisticService(userId, shippingMethodId) {
    try {
      const shippingMethod = await ShippingMethod.findOne({
        user: userId,
        _id: shippingMethodId,
      });
      if (!shippingMethod) throw new Error("Shipping method not found");

      shippingMethod.isActive = !shippingMethod.isActive;
      await shippingMethod.save();
      return shippingMethod;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new ShippingMethodService();
