const mongoose = require("mongoose");
const shippingMethodSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
  estimatedDays: {
    type: Number,
    required: true,
  },
  shippingCompany: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});
exports.default = mongoose.model("ShippingMethod", shippingMethodSchema);
