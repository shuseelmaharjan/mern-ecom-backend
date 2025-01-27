const mongoose = require("mongoose");

const defaultPolicySchema = new mongoose.Schema({
  policyName: { type: String, required: true },
  policyDescription: { type: String, required: true },
  isDefault: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: null },
});

const defaultPolicyLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  performedAt: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CompanyPolicy",
    required: true,
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  details: { type: String, required: true },
  modelAffected: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const defaultShippingPolicySchema = new mongoose.Schema({
  shippingPolicyName: { type: String, required: true },
  shippingMethod: { type: String, required: true },
  shippingDays: { type: String, required: true },
  shippingPolicyDescription: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  costofDelivery: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: null },
});

const defaultShippingLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  performedAt: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CompanyShippingPolicy",
    required: true,
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  details: { type: String, required: true },
  modelAffected: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const defaultReturnPolicySchema = new mongoose.Schema({
  policyName: { type: String, required: true },
  policyDescription: { type: String, required: true },
  isDefault: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: null },
});

const defaultReturnPolicyLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  performedAt: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CompanyShippingPolicy",
    required: true,
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  details: { type: String, required: true },
  modelAffected: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const ShopSchema = new mongoose.Schema({
  shopName: { type: String, required: true },
  shopLogo: { type: String, required: false, default: null },
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

const shopShippingPolicySchema = new mongoose.Schema({
  shippingPolicyName: { type: String, required: true },
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
  shippingDays: { type: String, required: true },
  shippingPolicyDescription: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  costofDelivery: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
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

const Shop = mongoose.models.Shop || mongoose.model("Shop", ShopSchema);

const CompanyPolicy =
  mongoose.models.CompanyPolicy ||
  mongoose.model("CompanyPolicy", defaultPolicySchema);

const CompanyPolicyLog =
  mongoose.models.CompanyPolicyLog ||
  mongoose.model("CompanyPolicyLog", defaultPolicyLogSchema);

const CompanyShippingPolicy =
  mongoose.models.CompanyShippingPolicy ||
  mongoose.model("CompanyShippingPolicy", defaultShippingPolicySchema);

const CompanyShippingPolicyLog =
  mongoose.models.CompanyShippingPolicyLog ||
  mongoose.model("CompanyShippingPolicyLog", defaultShippingLogSchema);

const CompanyReturnPolicy =
  mongoose.models.CompanyReturnPolicy ||
  mongoose.model("CompanyReturnPolicy", defaultReturnPolicySchema);

const CompanyReturnPolicyLog =
  mongoose.models.CompanyReturnPolicyLog ||
  mongoose.model("CompanyReturnPolicyLog", defaultReturnPolicyLogSchema);

const ShopShippingPolicy =
  mongoose.models.ShopShippingPolicy ||
  mongoose.model("ShopShippingPolicy", shopShippingPolicySchema);

const ShopReturnPolicy =
  mongoose.models.ShopReturnPolicy ||
  mongoose.model("ShopReturnPolicy", shopReturnPolicySchema);

module.exports = {
  Shop,
  CompanyPolicy,
  CompanyPolicyLog,
  CompanyShippingPolicy,
  CompanyShippingPolicyLog,
  CompanyReturnPolicy,
  CompanyReturnPolicyLog,
  ShopShippingPolicy,
  ShopReturnPolicy,
};
