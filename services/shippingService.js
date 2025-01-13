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

  async updateShippingAddress(userId, shippingAddressId, updateData) {
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
      } = updateData;

      const newData = {
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

      const shippingAddress = user.shippingAddresses.id(shippingAddressId);
      if (!shippingAddress) {
        throw new Error("Shipping address not found");
      }

      Object.assign(shippingAddress, newData);
      user.lastUpdate = new Date();

      await user.save();
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getIndividualShippingAddress(userId, shippingAddressId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      const shippingAddress = user.shippingAddresses.id(shippingAddressId);
      if (!shippingAddress) {
        throw new Error("Shipping address not found");
      }

      return shippingAddress;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateDefaultShippingAddress(userId, shippingId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found.");
    }

    const shippingAddress = user.shippingAddresses.find(
      (address) => address._id.toString() === shippingId
    );

    if (!shippingAddress) {
      throw new Error("Shipping address not found.");
    }

    user.shippingAddresses.forEach((address) => {
      address.isDefault = false;
    });

    shippingAddress.isDefault = true;

    await user.save();
    return shippingAddress;
  }

  async updateDefaultBillingAddress(userId, shippingId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found.");
    }

    const shippingAddress = user.shippingAddresses.find(
      (address) => address._id.toString() === shippingId
    );

    if (!shippingAddress) {
      throw new Error("Shipping address not found.");
    }

    user.shippingAddresses.forEach((address) => {
      address.defaultBilling = false;
    });

    shippingAddress.defaultBilling = true;

    await user.save();
    return shippingAddress;
  }
}

module.exports = new ShippingService();
