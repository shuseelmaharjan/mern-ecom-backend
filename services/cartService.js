const Engagement = require("../models/engagement");
const Product = require("../models/product");
const { Campaign } = require("../models/campaign");
const Users = require("../models/users");
const { Charge } = require("../models/site");

class CartService {
  async getCartProductDetails(productId, sku) {
    const product = await Product.findById(productId)
      .populate("shipping")
      .lean();
    if (!product) {
      throw new Error("Product not found");
    }

    console.log("Product found:", product); // Log product for debugging

    if (!product.variations || product.variations.length === 0) {
      throw new Error("No variations found for this product");
    }

    const variation = product.variations.find((v) => v.sku === sku);
    if (!variation) {
      console.log("Variation not found for SKU:", sku); // Log SKU for debugging
      throw new Error("Variation not found");
    }

    let price;
    if (variation.hasUniquePrice) {
      price = variation.price;
    } else {
      price = product.price;
    }

    const productInfo = {
      title: product.title,
      price: price,
      brand: product.brand,
      weight: product.weight,
      shape: product.shape,
      hasDimension: product.hasDimension,
      productHeight: product.productHeight,
      productWidth: product.productWidth,
      customOrder: product.customOrder,
      shipping: product.shipping,
      skuData: {
        ...variation,
        media: {
          image: variation.media.images[0] || null,
        },
      },
    };

    return { product: productInfo, price };
  }

  async getCartEngagement(productId) {
    const engagement = await Engagement.findOne({
      productId,
    }).populate("campaignId");

    return engagement;
  }

  calculateDiscountedPrice(price, discountPercentage) {
    const discount = (price * discountPercentage) / 100;
    const finalPrice = price - discount;
    return { discount, finalPrice };
  }

  async calculateTotalPrice(products) {
    const results = [];
    let totalRequestedAmount = 0;
    let totalDiscountAmount = 0;
    let totalFinalAmount = 0;

    for (const { productId, sku, quantity } of products) {
      const { product, price } = await this.getCartProductDetails(
        productId,
        sku
      );
      const engagement = await this.getCartEngagement(productId);

      let discount = 0;
      let finalPrice = price;
      let engagementInfo = null;

      if (
        engagement &&
        engagement.campaignId &&
        engagement.campaignId.isActive
      ) {
        const campaign = engagement.campaignId;
        const discountedPrices = this.calculateDiscountedPrice(
          price,
          campaign.discountPercentage
        );
        discount = discountedPrices.discount;
        finalPrice = discountedPrices.finalPrice;
        engagementInfo = {
          campaignId: campaign._id,
          title: campaign.title,
          description: campaign.description,
          discountPercentage: campaign.discountPercentage,
          isActive: campaign.isActive,
        };
      }

      const totalCost = finalPrice * quantity;

      // Update aggregate totals
      totalRequestedAmount += price * quantity;
      totalDiscountAmount += discount * quantity;
      totalFinalAmount += totalCost;

      results.push({
        product,
        sku,
        quantity,
        price,
        discount,
        finalPrice,
        totalCost,
        engagementInfo,
      });
    }

    return {
      products: results,
      totalRequestedAmount,
      totalDiscountAmount,
      totalFinalAmount,
    };
  }

  async addToCart(userId, productId, quantity, color, size, sku) {
    console.log("Users model:", Users);
    const user = await Users.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    user.myCart.push({ productId, quantity, color, size, sku });
    await user.save();
    return user.myCart;
  }

  async removeFromCart(userId, cartId) {
    const user = await Users.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const cartItemIndex = user.myCart.findIndex(
      (cartItem) => cartItem._id.toString() === cartId
    );

    if (cartItemIndex === -1) {
      throw new Error("Cart item not found");
    }

    user.myCart.splice(cartItemIndex, 1);

    await user.save();
  }

  async myCartItems(userId, selectedCartItemIds) {
    console.log(selectedCartItemIds);
    const user = await Users.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    let sumOfAllProducts = 0;
    let sumOfDiscountedAmounts = 0;
    let sumOfTotalPricesAfterDiscount = 0;

    // Fetch the active tax percentage
    const activeTax = await Charge.findOne({ isActive: true });
    const taxPercentage = activeTax ? activeTax.tax : 0;

    // If no selectedCartItemIds provided, consider all items
    const selectedIds =
      selectedCartItemIds && selectedCartItemIds.length > 0
        ? selectedCartItemIds.map((id) => id.toString())
        : user.myCart.map((item) => item._id.toString());

    const cartItems = await Promise.all(
      user.myCart.map(async (cartItem) => {
        const product = await Product.findById(cartItem.productId);
        if (!product) {
          throw new Error(`Product with ID ${cartItem.productId} not found`);
        }

        const variation = product.variations.find(
          (v) => v.sku === cartItem.sku
        );
        if (!variation) {
          throw new Error(`Variation with SKU ${cartItem.sku} not found`);
        }

        const engagement = await Engagement.findOne({
          userId,
          productId: cartItem.productId,
        });

        let campaign = null;
        let offeredPrice = null;
        let price = variation.hasUniquePrice ? variation.price : product.price;

        if (engagement) {
          campaign = await Campaign.findById(engagement.campaignId);
          if (campaign && campaign.isActive) {
            offeredPrice = price - (campaign.discountPercentage / 100) * price;
          }
        }

        const finalPrice = offeredPrice || price;

        // Calculate sums only for selected items
        if (selectedIds.includes(cartItem._id.toString())) {
          sumOfAllProducts += price * cartItem.quantity;
          sumOfTotalPricesAfterDiscount += finalPrice * cartItem.quantity;
          if (offeredPrice) {
            sumOfDiscountedAmounts +=
              (price - offeredPrice) * cartItem.quantity;
          }
        }

        return {
          _id: cartItem._id,
          productId: cartItem.productId,
          quantity: cartItem.quantity,
          color: cartItem.color,
          size: cartItem.size,
          sku: cartItem.sku,
          title: product.title,
          price,
          image: variation.media.images[0],
          campaign: campaign
            ? {
                title: campaign.title,
                expiryTime: campaign.expiryTime,
                image: campaign.image,
                poster: campaign.poster,
                discountPercentage: campaign.discountPercentage,
                saleType: campaign.saleType,
                offeredPrice,
              }
            : null,
        };
      })
    );

    // Calculate tax amount
    const taxAmount = parseFloat(
      (sumOfTotalPricesAfterDiscount * (taxPercentage / 100)).toFixed(2)
    );
    const totalWithTax = parseFloat(
      (sumOfTotalPricesAfterDiscount + taxAmount).toFixed(2)
    );

    return {
      cartItems, // All items
      sum: parseFloat(sumOfAllProducts.toFixed(2)), // Only selected items
      discountedAmount: parseFloat(sumOfDiscountedAmounts.toFixed(2)),
      total: parseFloat(sumOfTotalPricesAfterDiscount.toFixed(2)),
      taxPercentage: taxPercentage,
      tax: taxAmount,
      totalWithTax: totalWithTax,
    };
  }

  async updateCartItems(userId, cartItems, action, cartId) {
    const user = await Users.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const itemIndex = cartItems.findIndex((item) => item.id === cartId);
    if (itemIndex === -1) {
      throw new Error("Item not found in cart");
    }

    if (action === "increase") {
      cartItems[itemIndex].quantity += 1;
    } else if (action === "decrease") {
      if (cartItems[itemIndex].quantity > 1) {
        cartItems[itemIndex].quantity -= 1;
      } else {
        throw new Error("Quantity cannot be less than 1");
      }
    } else {
      throw new Error("Invalid action");
    }

    user.myCart = cartItems;
    await user.save();
  }

  async myTotalCartItems(userId) {
    const user = await Users.findById(userId);
    if (!user) {
      return 0;
    }
    return user.myCart.length;
  }
}

module.exports = new CartService();
