const jwt = require("jsonwebtoken");
const shopService = require("../services/shopService");
require("dotenv").config();
const GetUserId = require("../helper/getUserId");

class ShopController {
  // Create Shop
  async create(req, res) {
    try {
      const id = new GetUserId(req);
      const userId = await id.getUserId();
      const result = await shopService.createShop(req.body, userId);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async myShopDetails(req, res) {
    try {
      const id = new GetUserId(req);
      const userId = await id.getUserId();
      const result = await shopService.myShopDetails(userId);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async updateShopLogo(req, res) {
    try {
      const shopId = req.params.shopId;

      if (!req.file) {
        return res.status(400).json({ error: "No image file provided." });
      }

      const logoPath = `/uploads/shop/${req.file.filename}`;
      const updatedShop = await shopService.updateShopLogo(shopId, logoPath);

      res.status(200).json({
        message: "Shop logo updated successfully.",
        shop: updatedShop,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateDescription(req, res) {
    const { shopId } = req.params;
    const { shopDescription } = req.body;

    if (!shopDescription) {
      return res.status(400).json({ error: "Description is required" });
    }

    try {
      const updatedShop = await shopService.updateDescription(
        shopId,
        shopDescription
      );
      return res.status(200).json({
        message: "Shop description updated successfully",
        shop: updatedShop,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
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

  async createShopPolicy(req, res) {
    try {
      const shopId = req.params.shopId;
      const shippingPolicy = req.body;

      const result = await shopService.createShippingPolicy(
        shopId,
        shippingPolicy
      );
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getShopPolicies(req, res) {
    try {
      const shopId = req.params.shopId;
      const result = await shopService.getShippingPolicies(shopId);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async deactivateShopShippingPolicy(req, res) {
    const { policyId } = req.params;

    try {
      const updatedPolicy = await shopService.deactivateShopShippingPolicy(
        policyId
      );
      res.status(200).json(updatedPolicy);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async createShopReturnPolicy(req, res) {
    try {
      const shopId = req.params.shopId;
      const returnPolicy = req.body;

      const result = await shopService.createShopReturnPolicy(
        shopId,
        returnPolicy
      );
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getShopReturnPolicies(req, res) {
    try {
      const shopId = req.params.shopId;
      const result = await shopService.getShopReturnPolicies(shopId);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async deactivateShopReturnPolicy(req, res) {
    const { policyId } = req.params;

    try {
      const updatedPolicy = await shopService.deactivateShopReturnPolicy(
        policyId
      );
      res.status(200).json(updatedPolicy);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new ShopController();
