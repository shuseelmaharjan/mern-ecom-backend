const express = require("express");
const cartContoller = require("../controller/cartController");
const { verifyAccessToken } = require("../middleware/authJWT");

const router = express.Router();

router.post("/v1/calculate-price", cartContoller.calculatePrice);
router.post("/v1/add-to-cart", verifyAccessToken, cartContoller.addToCart);
router.get("/v1/my-cart-items", cartContoller.myCartItems);
router.get("/v1/my-total-cart-items", cartContoller.myTotalCartItems);
router.delete(
  "/v1/remove-from-cart/:cartId",
  verifyAccessToken,
  cartContoller.removeFromCart
);
router.put(
  "/v1/update-cart-item/:cartId/:action",
  verifyAccessToken,
  cartContoller.updateCartItems
);

module.exports = router;
