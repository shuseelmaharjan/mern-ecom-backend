const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "Category",
    required: true,
  },
  description: { type: String, default: null, required: false },
  price: { type: Number, default: 0 },
  quantity: { type: Number, default: null },
  productLimit: { type: Number, default: null },
  brand: { type: String, default: null },
  weight: { type: Number, default: null },
  shape: { type: String, default: null },
  hasDimension: { type: Boolean, default: false },
  dimension: {
    width: { type: Number, default: null },
    height: { type: Number, default: null },
  },
  hasColor: { type: Boolean, default: false },
  color: [{ type: String, default: null }],
  material: { type: String, default: null },
  hasSize: { type: Boolean, default: false },
  size: [{ type: String, default: null }],
  customOrder: { type: Boolean, default: false },
  tags: [{ type: String, default: null }],
  createdAt: { type: Date, default: Date.now },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  defaultShipping: { type: Boolean, default: true },
  shipping: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ShopShippingPolicy",
    required: false,
  },
  defaultReturnPolicy: { type: Boolean, default: true },
  returnPolicy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ShopReturnPolicy",
    required: false,
  },
  isActive: { type: Boolean, default: false },
  isDraft: { type: Boolean, default: true },
  haveVariations: { type: Boolean, default: false },
  variations: [
    {
      sku: { type: String, default: uuidv4 },
      hasUniquePrice: { type: Boolean, default: false },
      price: { type: Number, required: false },
      hasUniqueWeight: { type: Boolean, default: false },
      weight: { type: Number, required: false },
      color: { type: String, required: false },
      hasUniqueStock: { type: Boolean, default: false },
      stock: { type: Number, required: false },
      media: {
        images: [{ type: String, required: false }],
        video: { type: String, required: false },
      },
      isDefault: { type: Boolean, default: false },
    },
  ],
  views: { type: Number, default: 0 },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      rating: { type: Number, required: true, min: 0, max: 5 },
      comment: { type: String, required: true },
      images: [{ type: String, required: false }],
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

ProductSchema.pre("save", function (next) {
  if (this.variations && this.variations.length > 0) {
    this.variations.forEach((variation, index) => {
      variation.isDefault = index === 0;
    });
  }
  next();
});

module.exports = mongoose.model("Product", ProductSchema);
