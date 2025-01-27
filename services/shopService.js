const {
  Shop,
  ShopShippingPolicy,
  ShopReturnPolicy,
} = require("../models/shop");
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
      return { success: false, message: error.message || "An error occurred." };
    }
  }

  async myShopDetails(userId) {
    try {
      const shop = await Shop.findOne({ userId: userId })
        .populate({
          path: "categories",
          select: "name image",
        })
        .exec();

      return shop;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateShopLogo(shopId, logoPath) {
    const shop = await Shop.findById(shopId);
    if (!shop) {
      throw new Error("Shop not found");
    }

    shop.shopLogo = logoPath;
    shop.updatedDate = new Date();
    await shop.save();

    return shop;
  }

  async updateDescription(shopId, newDescription) {
    try {
      const shop = await Shop.findById(shopId);
      if (!shop) {
        throw new Error("Shop not found");
      }
      shop.shopDescription = newDescription;
      shop.updatedDate = new Date();
      await shop.save();
      return shop;
    } catch (error) {
      throw error;
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

  async createShippingPolicy(shopId, shippingPolicy) {
    const {
      shippingPolicyName,
      shippingDays,
      shippingPolicyDescription,
      costofDelivery,
    } = shippingPolicy;

    try {
      const newShippingPolicy = new ShopShippingPolicy({
        shippingPolicyName,
        shippingDays,
        shippingPolicyDescription,
        costofDelivery,
        shopId,
      });

      const savedPolicy = await newShippingPolicy.save();
      return savedPolicy;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getShippingPolicies(shopId) {
    try {
      const policies = await ShopShippingPolicy.find({
        shopId,
        isActive: true,
      });
      return policies;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deactivateShopShippingPolicy(policyId) {
    try {
      const updatedPolicy = await ShopShippingPolicy.findByIdAndUpdate(
        policyId,
        { isActive: false },
        { new: true }
      );
      if (!updatedPolicy) {
        throw new Error("Shipping Policy not found");
      }
      return updatedPolicy;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async createShopReturnPolicy(shopId, policy) {
    try {
      const newPolicy = new ShopReturnPolicy({
        shopId,
        ...policy,
      });
      const savedPolicy = await newPolicy.save();
      return savedPolicy;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getShopReturnPolicies(shopId) {
    try {
      const policies = await ShopReturnPolicy.find({ shopId, isActive: true });
      return policies;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deactivateShopReturnPolicy(policyId) {
    try {
      const updatedPolicy = await ShopReturnPolicy.findByIdAndUpdate(
        policyId,
        { isActive: false },
        { new: true }
      );
      if (!updatedPolicy) {
        throw new Error("Return Policy not found");
      }
      return updatedPolicy;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = new ShopService();
