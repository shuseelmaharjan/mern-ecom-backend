const { Shop } = require("../models/shop");
const User = require("../models/users");

class ShopService {
  // Create Shop
  async createShop(data, userId) {
    const { shopName, shopDescription, categories } = data;

    const existingShop = await Shop.findOne({ userId: userId });

    try {
      if (existingShop) {
        return { success: false, message: "User can only create one shop." };
      }
      const newShop = new Shop({
        shopName,
        shopDescription,
        categories,
        userId,
      });
      const user = await User.findById(userId);
      if (user) {
        user.isUser = false;
        user.isVendor = true;
        await user.save();
      }
      await newShop.save();
      return { success: true, message: "Shop created successfully." };
    } catch (error) {
      console.error("Error creating shop:", error);
      return { success: false, message: error.message || "An error occurred." };
    }
  }

  // Update Shop
  async updateShop(shopId, updatedData) {
    try {
      const shop = await Shop.findByIdAndUpdate(shopId, updatedData, {
        new: true,
      });
      if (!shop) {
        throw new Error("Shop not found");
      }
      return { success: true, shop };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Deactivate Shop (set isActive to false)
  async deactivateShop(shopId) {
    try {
      const shop = await Shop.findById(shopId);
      if (!shop) {
        throw new Error("Shop not found");
      }

      shop.isActive = false;
      await shop.save();
      return { success: true, message: "Shop deactivated" };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getShopByUserId(userId) {
    try {
      const shop = await Shop.findOne({ userId });
      return shop;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = new ShopService();
