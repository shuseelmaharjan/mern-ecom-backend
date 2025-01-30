const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "Category",
    required: true,
  },
  description: { type: String, required: false },
  price: { type: Number, required: false },
  quantity: { type: Number, required: false },
  productLimit: { type: Number, required: false },
  brand: { type: String, required: false },
  weight: { type: Number, required: false },
  shape: { type: String, required: false },
  hasDimension: { type: Boolean, default: false },
  productHeight: { type: Number, required: false },
  productWidth: { type: Number, required: false },
  hasColor: { type: Boolean, default: false },
  color: [{ type: String, required: false }],
  material: { type: String, required: false },
  hasSize: { type: Boolean, default: false },
  size: [{ type: String, required: false }],
  customOrder: { type: Boolean, default: false },
  tags: [{ type: String, required: false }],
  createdAt: { type: Date, default: Date.now },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
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
        ref: "Users",
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
