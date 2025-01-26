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
  shippingPolicyDescription: { type: String, required: true },
});

const defaultShippingLogSchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    field: { type: String, required: true },
    previousValue: { type: String, default: null },
    newValue: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

const defaultReturnPolicySchema = new mongoose.Schema({
  returnPolicyName: { type: String, required: true },
  returnPolicyDescription: { type: String, required: true },
});

const defaultReturnPolicyLogSchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    field: { type: String, required: true },
    previousValue: { type: String, default: null },
    newValue: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

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
