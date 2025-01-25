const mongoose = require("mongoose");

const defaultPolicySchema = new mongoose.Schema({
  policyName: { type: String, required: true },
  policyDescription: { type: String, required: true },
});

const defaultShippingPolicySchema = new mongoose.Schema({
  shippingPolicyName: { type: String, required: true },
  shippingPolicyDescription: { type: String, required: true },
});

const defaultReturnPolicySchema = new mongoose.Schema({
  returnPolicyName: { type: String, required: true },
  returnPolicyDescription: { type: String, required: true },
});

const ShopSchema = new mongoose.Schema({
  shopName: { type: String, required: true },
  ownerName: { type: String, required: false, default: null },
  shopLogo: { type: String, required: false },
  shopDescription: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: null },
  isActive: { type: Boolean, default: true },
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  ],
  views: { type: Number, default: 0 },
});

const shopPolicySchema = new mongoose.Schema({
  shopPolicy: { type: String, required: true },
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
  defaultPolicyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DefaultPolicy",
    required: true,
  },
  createdDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: null },
  isActive: { type: Boolean, default: true },
});

const shopShippingPolicySchema = new mongoose.Schema({
  shippingPolicy: { type: String, required: true },
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
  defaultShippingPolicyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DefaultShippingPolicy",
    required: true,
  },
  createdDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: null },
  isActive: { type: Boolean, default: true },
});

const shopReturnPolicySchema = new mongoose.Schema({
  returnPolicy: { type: String, required: true },
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
  defaultReturnPolicyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DefaultReturnPolicy",
    required: true,
  },
  createdDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: null },
  isActive: { type: Boolean, default: true },
});

module.exports = {
  Shop: mongoose.model("Shop", ShopSchema),
  ShopPolicy: mongoose.model("ShopPolicy", shopPolicySchema),
  ShopShippingPolicy: mongoose.model(
    "ShopShippingPolicy",
    shopShippingPolicySchema
  ),
  ShopReturnPolicy: mongoose.model("ShopReturnPolicy", shopReturnPolicySchema),
  DefaultPolicy: mongoose.model("DefaultPolicy", defaultPolicySchema),
  DefaultShippingPolicy: mongoose.model(
    "DefaultShippingPolicy",
    defaultShippingPolicySchema
  ),
  DefaultReturnPolicy: mongoose.model(
    "DefaultReturnPolicy",
    defaultReturnPolicySchema
  ),
};
