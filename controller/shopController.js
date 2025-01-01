const ShopService = require('../services/shopService');


class ShopController {

    // Create Shop
    async create(req, res) {
        try {
            const userId = req.user.id;
            const { shopName, ownerName, shopDescription } = req.body;
            
            const shopLogo = req.file ? `/shop/${req.file.filename}` : null; 

            const newShopData = {
                shopName,
                ownerName,
                shopLogo,
                shopDescription,
                userId
            };

            const shopService = new ShopService(); 
            const result = await shopService.createShop(newShopData);
            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    // Update Shop
    async update(req, res) {
        try {
            const shopId = req.params.id;
            const { shopName, ownerName, shopDescription } = req.body;

            const shopLogo = req.file ? `/shop/${req.file.filename}` : null; 

            const shopService = new ShopService(); 
            const result = await shopService.updateShop(shopId, {
                shopName, 
                ownerName, 
                shopLogo, 
                shopDescription, 
                updatedDate: new Date()
            });
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async deactivate(req, res) {
        try {
            const shopId = req.params.id;
            const shopService = new ShopService();  
            const result = await shopService.deactivateShop(shopId);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
}

module.exports = new ShopController();
