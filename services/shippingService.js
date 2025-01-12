const User = require("../models/users");

class ShippingService {
  async getShippingAddresses(userId) {
    try {
      const user = await User.findById(userId, "shippingAddresses");
      if (!user) {
        throw new Error("User not found");
      }
      return user.shippingAddresses;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async addShippingAddress(userId, addressData) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      const {
        fullName,
        addressLine1,
        city,
        state,
        postalCode,
        country,
        phone,
        address,
      } = addressData;

      const newAddress = {
        fullName,
        addressLine1,
        city,
        state,
        postalCode,
        country,
        phone,
        isHome: address === "home",
        isOffice: address === "office",
      };

      user.shippingAddresses.push(newAddress);
      await user.save();

      return { success: true, message: "Address added successfully", user };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = new ShippingService();
