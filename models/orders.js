const mongoose = require("mongoose");
const uuid = require("uuid");
const product = require("./product");

const orderSchema = mongoose.Schema({
  orderId: { type: Number, unique: true },
  orderDate: { type: Date, default: Date.now },
  orderStatus: {
    type: String,
    enum: ["PENDING", "SHIPPED", "DELIVERED", "RETURNED", "CANCELLED"],
    required: true,
    default: "PENDING",
  },
  orderItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  paymentMethod: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PaymentMethod",
    required: false,
  },
  paymentStatus: {
    type: String,
    enum: ["PENDING", "PAID", "FAILED"],
    required: true,
    default: "PENDING",
  },
  orderBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  orderTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
    required: true,
  },
  sku: { type: String, required: true },
  quantity: { type: Number, required: true },
  customOrder: { type: Boolean, required: false, default: false },
  orderNote: { type: String, required: false },
  shippingAddress: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    addressIndex: { type: Number, required: true },
  },
  shippingMethod: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ShippingMethod",
    required: false,
  },
  trackingNumber: { type: String, required: false },
  productCost: { type: Number, required: true },
  tax: { type: Number, required: false },
  productSize: { type: String, required: false },
  productColor: { type: String, required: false },
  discount: { type: Number, required: false },
  shippingCost: { type: Number, required: true },
  logisticCost: { type: Number, required: false },
  shippingDate: { type: Date, default: null },
  receiverName: { type: String, required: true },
  receiverPhone: { type: String, required: true },
  receiverEmail: { type: String, required: true },
  receiverAddress: { type: String, required: true },
  receiverAddress2: { type: String, required: false },
  receiverCity: { type: String, required: true },
  receiverState: { type: String, required: true },
  receiverPostalCode: { type: String, required: true },
  receiverCountry: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null },
  deliveredAt: { type: Date, default: null },
  cancelledAt: { type: Date, default: null },
  isCancelled: { type: Boolean, default: false },
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: false,
  },
  cancelledReason: { type: String, required: false },
});

orderSchema.pre("save", async function (next) {
  if (this.isNew) {
    const lastOrder = await mongoose
      .model("Order")
      .findOne()
      .sort({ orderId: -1 });
    this.orderId = lastOrder ? lastOrder.orderId + 1 : 1;
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);
