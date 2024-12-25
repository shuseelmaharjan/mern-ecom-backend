const Shop = require('../models/shop');

class ShopService {
    // Create Shop
    async createShop(newShopData) {
        try {
            const existingShop = await Shop.findOne({ userId: newShopData.userId });
            if (existingShop) {
                throw new Error('User can only create one shop.');
            }

            const shop = new Shop(newShopData);
            await shop.save();
            return { success: true, shop };
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // Update Shop
    async updateShop(shopId, updatedData) {
        try {
            const shop = await Shop.findByIdAndUpdate(shopId, updatedData, { new: true });
            if (!shop) {
                throw new Error('Shop not found');
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
                throw new Error('Shop not found');
            }

            shop.isActive = false;
            await shop.save();
            return { success: true, message: 'Shop deactivated' };
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = ShopService;
