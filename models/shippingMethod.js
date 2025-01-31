const mongoose = require("mongoose");

const ShippingMethodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  shippingCompany: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
});

const ShippingMethod = mongoose.model("ShippingMethod", ShippingMethodSchema);

module.exports = ShippingMethod;
