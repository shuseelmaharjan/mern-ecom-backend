const jwt = require("jsonwebtoken");
const ShopService = require("../services/shopService");
require("dotenv").config();

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
        userId,
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
        updatedDate: new Date(),
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
  async getShopDetails(req, res) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res
          .status(401)
          .json({ success: false, message: "Access token is required" });
      }

      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      const { UserInfo } = decodedToken;
      if (!UserInfo) {
        return res.status(400).json({
          success: false,
          message: "Invalid token structure: UserInfo missing",
        });
      }

      const { id: userId, role } = UserInfo;

      // Check if the role is "vendor"
      if (role !== "vendor") {
        return res.status(403).json({
          success: false,
          message: "Forbidden: Only vendors can access this resource",
        });
      }

      const shopService = new ShopService();
      const shop = await shopService.getShopByUserId(userId);

      if (!shop) {
        return res
          .status(404)
          .json({ success: false, message: "Shop not found" });
      }

      // Respond with the shop details
      res.status(200).json({ success: true, shop });
    } catch (error) {
      // Handle errors
      console.error("Error in getShopDetails:", error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new ShopController();
