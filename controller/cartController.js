const cartService = require("../services/cartService");
const GetUserId = require("../helper/getUserId");
const Users = require("../models/users");

class CartController {
  async calculatePrice(req, res) {
    const { products } = req.body;
    console.log(products);

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res
        .status(400)
        .json({ message: "Missing or invalid products parameter" });
    }

    try {
      const results = await cartService.calculateTotalPrice(products);
      return res.json(results);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  }

  async addToCart(req, res) {
    const { productId, quantity, color, size, sku } = req.body;
    const id = new GetUserId(req);
    const userId = await id.getUserId();

    if (!productId || !quantity || !color || !size || !sku) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    try {
      await cartService.addToCart(
        userId,
        productId,
        quantity,
        color,
        size,
        sku
      );
      return res.json({ message: "Product added to cart" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  }

  async myTotalCartItems(req, res) {
    const id = new GetUserId(req);
    const userId = await id.getUserId();

    try {
      const cartItems = await cartService.myTotalCartItems(userId);
      res.status(200).json({ success: true, cartItems });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  }

  async removeFromCart(req, res) {
    try {
      const id = new GetUserId(req);
      const userId = await id.getUserId();
      const cartId = req.params.cartId;

      if (!cartId) {
        return res.status(400).json({ message: "Cart ID is required" });
      }

      await cartService.removeFromCart(userId, cartId);

      return res.json({ message: "Product removed from cart" });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "An error occurred", error: error.message });
    }
  }

  async myCartItems(req, res) {
    const id = new GetUserId(req);
    const userId = await id.getUserId();

    try {
      const selectedCartItemIds = req.query.selectedCartItemIds
        ? req.query.selectedCartItemIds.split(",")
        : [];

      console.log("Received selectedCartItemIds:", selectedCartItemIds);

      const cartData = await cartService.myCartItems(
        userId,
        selectedCartItemIds
      );
      return res.status(200).json(cartData);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  }

  async updateCartItems(req, res) {
    const id = new GetUserId(req);
    const userId = await id.getUserId();
    const { cartId, action } = req.params;
    try {
      const user = await Users.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const cartItems = user.myCart;
      await cartService.updateCartItems(userId, cartItems, action, cartId);
      return res.json({ message: "Cart updated successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  }

  async myCheckout(req, res) {
    const id = new GetUserId(req);
    const userId = await id.getUserId();
    console.log(req.headers);

    try {
      const selectedCartItemIds = req.query.selectedCartItemIds
        ? req.query.selectedCartItemIds.split(",")
        : [];

      const { shippingPolicyId } = req.params;

      console.log("Received selectedCartItemIds:", selectedCartItemIds);
      console.log("Received shippingPolicyId:", shippingPolicyId);

      const cartData = await cartService.myCheckout(
        userId,
        selectedCartItemIds,
        shippingPolicyId
      );
      return res.status(200).json(cartData);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new CartController();
