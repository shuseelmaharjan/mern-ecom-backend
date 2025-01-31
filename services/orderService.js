const Order = require("../models/orders");
const Product = require("../models/product");
const { Shop } = require("../models/shop");
const User = require("../models/users");
const ShippingMethod = require("../models/shippingMethod");

class OrderService {
  static async createOrder(orderData, userId) {
    const {
      orderItem,
      quantity,
      customOrder,
      orderNote,
      shippingAddress,
      sku,
      productCost,
      discount,
      shippingCost,
      productColor,
      productSize,
    } = orderData;

    try {
      const product = await Product.findById(orderItem).populate("createdBy");
      if (!product) throw new Error("Product not found");

      const vendorId = product.createdBy._id;
      const shop = await Shop.findOne({ userId: vendorId });
      if (!shop) throw new Error("Shop not found for this vendor");

      const shopId = shop._id;
      const user = await User.findById(userId);
      if (!user) throw new Error("User not found");

      const shippingAddr = user.shippingAddresses.id(shippingAddress);
      if (!shippingAddr) throw new Error("Invalid shipping address");

      const order = new Order({
        orderItem,
        orderBy: userId,
        orderTo: shopId,
        sku,
        quantity,
        customOrder,
        orderNote,
        shippingAddress: {
          user: userId,
          addressIndex: user.shippingAddresses.indexOf(shippingAddr),
        },
        productCost,
        discount,
        shippingCost,
        receiverName: shippingAddr.fullName,
        receiverPhone: shippingAddr.phone,
        receiverEmail: user.email,
        receiverAddress: shippingAddr.addressLine1,
        receiverAddress2: shippingAddr.addressLine2 || "",
        receiverCity: shippingAddr.city,
        receiverState: shippingAddr.state,
        receiverPostalCode: shippingAddr.postalCode,
        receiverCountry: shippingAddr.country,
        orderStatus: "PENDING",
        productColor,
        productSize,
      });

      await order.save();
      return order;
    } catch (error) {
      console.error("Order Creation Error:", error.message);
      throw new Error(error.message);
    }
  }

  static async getOrdersByShop(vendorId, orderStatus, date) {
    try {
      const shop = await Shop.findOne({ userId: vendorId });
      if (!shop) throw new Error("Shop not found for this vendor");

      const shopId = shop._id;
      const query = { orderTo: shopId };

      if (
        ["PENDING", "SHIPPED", "DELIVERED", "RETURNED"].includes(orderStatus)
      ) {
        query.orderStatus = orderStatus;
      }

      if (date && date !== "all") {
        let days;
        switch (date) {
          case "last-week":
            days = 7;
            break;
          case "last-month":
            days = 30;
            break;
          case "last-year":
            days = 365;
            break;
          case "today":
            days = 1;
            break;
          default:
            days = null;
        }
        if (days) {
          const fromDate = new Date();
          fromDate.setDate(fromDate.getDate() - days);
          query.createdAt = { $gte: fromDate };
        }
      }

      const orders = await Order.find(query)
        .populate("orderItem", "_id title")
        .populate("orderBy", "_id name email")
        .select(
          "_id orderStatus orderItem paymentStatus orderBy orderTo sku productSize productColor quantity customOrder productCost discount shippingCost shippingDate receiverName receiverPhone receiverEmail receiverAddress receiverAddress2 receiverCity receiverState receiverPostalCode receiverCountry orderDate createdAt orderId deliveredAt __v"
        );

      return orders.map((order) => {
        const user = order.shippingAddress.user;
        const addressIndex = order.shippingAddress.addressIndex;
        const selectedAddress = user?.shippingAddresses?.[addressIndex] || null;
        return {
          _id: order._id,
          orderStatus: order.orderStatus,
          orderItem: order.orderItem,
          paymentStatus: order.paymentStatus,
          orderBy: order.orderBy,
          orderTo: order.orderTo,
          sku: order.sku,
          productSize: order.productSize,
          productColor: order.productColor,
          quantity: order.quantity,
          customOrder: order.customOrder,
          productCost: order.productCost,
          discount: order.discount,
          shippingCost: order.shippingCost,
          shippingDate: order.shippingDate,
          receiverName: order.receiverName,
          receiverPhone: order.receiverPhone,
          receiverEmail: order.receiverEmail,
          receiverAddress: order.receiverAddress,
          receiverAddress2: order.receiverAddress2,
          receiverCity: order.receiverCity,
          receiverState: order.receiverState,
          receiverPostalCode: order.receiverPostalCode,
          receiverCountry: order.receiverCountry,
          orderDate: order.orderDate,
          createdAt: order.createdAt,
          orderId: order.orderId,
          deliveredAt: order.deliveredAt,
          __v: order.__v,
        };
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async getOrderDetails(orderId) {
    // Find the order by its _id
    const order = await Order.findById(orderId)
      .populate("orderItem")
      .populate("orderTo")
      .exec();

    if (!order) {
      throw new Error("Order not found");
    }

    const product = await Product.findById(order.orderItem);

    if (!product) {
      throw new Error("Product not found");
    }

    const shop = await Shop.findById(order.orderTo);

    if (!shop) {
      throw new Error("Shop not found");
    }

    let shippingMethodDetails = null;
    if (order.shippingMethod) {
      const shippingMethod = await ShippingMethod.findById(
        order.shippingMethod
      );
      if (!shippingMethod) {
        throw new Error("Shipping method not found");
      }
      shippingMethodDetails = {
        name: shippingMethod.name,
        shippingCompany: shippingMethod.shippingCompany,
      };
    }

    let price;
    let image;
    if (product.haveVariations) {
      const variation = product.variations.find(
        (variation) => variation.sku === order.sku
      );
      if (variation) {
        price = variation.hasUniquePrice ? variation.price : product.price;
        image = variation.media.images[0];
      }
    } else {
      price = product.price;
      image =
        product.variations.length > 0
          ? product.variations[0].media.images[0]
          : null;
    }

    const productData = {
      title: product.title,
      category: product.category,
      description: product.description,
      price: price,
      weight: product.haveVariations
        ? product.variations.find((variation) => variation.sku === order.sku)
            ?.weight
        : product.weight,
      color: product.haveVariations
        ? product.variations.find((variation) => variation.sku === order.sku)
            ?.color
        : product.color,
      stock: product.haveVariations
        ? product.variations.find((variation) => variation.sku === order.sku)
            ?.stock
        : product.quantity,
      image: image,
    };

    const orderData = {
      _id: order._id,
      orderId: order.orderId,
      orderDate: order.orderDate,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      sku: order.sku,
      quantity: order.quantity,
      customOrder: order.customOrder,
      orderNote: order.orderNote,
      trackingNumber: order.trackingNumber,
      productCost: order.productCost,
      productSize: order.productSize,
      productColor: order.productColor,
      discount: order.discount,
      shippingCost: order.shippingCost,
      shippingDate: order.shippingDate,
      receiverName: order.receiverName,
      receiverPhone: order.receiverPhone,
      receiverEmail: order.receiverEmail,
      receiverAddress: order.receiverAddress,
      receiverAddress2: order.receiverAddress2,
      receiverCity: order.receiverCity,
      receiverState: order.receiverState,
      receiverPostalCode: order.receiverPostalCode,
      receiverCountry: order.receiverCountry,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      deliveredAt: order.deliveredAt,
      cancelledAt: order.cancelledAt,
      isCancelled: order.isCancelled,
      cancelledBy: order.cancelledBy,
      cancelledReason: order.cancelledReason,
      shopDescription: shop.description,
      logisticCost: order.logisticCost,
      shippingMethod: shippingMethodDetails,
    };

    return { order: orderData, product: productData };
  }

  static async placeOrder(
    orderId,
    shippingMethod,
    trackingNumber,
    logisticCost
  ) {
    const order = await Order.findById(orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    order.shippingMethod = shippingMethod;
    order.trackingNumber = trackingNumber;
    order.logisticCost = logisticCost;
    order.orderStatus = "SHIPPED";
    order.shippingDate = new Date();

    await order.save();

    return order;
  }

  static async deliveredOrder(orderId) {
    const order = await Order.findById(orderId).populate("orderItem");

    if (!order) {
      throw new Error("Order not found");
    }

    const product = order.orderItem;

    if (!product) {
      throw new Error("Product not found");
    }

    order.orderStatus = "DELIVERED";
    order.deliveredAt = new Date();

    product.sales = (product.sales || 0) + 1;

    // Save the updated product and order
    await product.save();
    await order.save();

    return order;
  }
}

module.exports = OrderService;
