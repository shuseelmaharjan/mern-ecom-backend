const Order = require("../models/orders");
const Product = require("../models/product");
const { Shop } = require("../models/shop");
const User = require("../models/users");

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
        ["PENDING", "SHIPPED", "DELIVERED", "CANCELLED"].includes(orderStatus)
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
        .populate("orderItem", "_id title") // only populate specific fields
        .populate("orderBy", "_id name email") // only populate specific fields
        .select(
          "_id orderStatus orderItem paymentStatus orderBy orderTo sku quantity customOrder productCost discount shippingCost shippingDate receiverName receiverPhone receiverEmail receiverAddress receiverAddress2 receiverCity receiverState receiverPostalCode receiverCountry orderDate createdAt orderId __v"
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
          __v: order.__v,
        };
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = OrderService;
