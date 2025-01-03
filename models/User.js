const mongoose = require("mongoose");

// Define the embedded Shipping Address Schema
const shippingAddressSchema = mongoose.Schema({
  fullName: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String, required: false, default: null },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null },
});

// User Schema with Shipping Address as an embedded array
const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  isVendor: { type: Boolean, default: false },
  isUser: { type: Boolean, default: true },
  isStaff: { type: Boolean, default: false },
  isActive: { type: Boolean, required: true, default: true },
  phoneNumber: { type: String, required: false, default: null },
  profileImg: { type: String, required: false, default: null },
  createdAt: { type: Date, default: Date.now },
  lastUpdate: { type: Date, required: false, default: null },
  shippingAddresses: [shippingAddressSchema],
});

module.exports = mongoose.model("Users", userSchema);
