const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "Category",
    required: true,
  },
  categoryModel: {
    type: String,
    required: true,
    enum: ["Category", "SubCategory", "GrandCategory"],
  },
  description: { type: String, required: false },
  price: { type: Number, required: true },
  quantity: { type: Number, required: false },
  productLimit: { type: Number, required: false },
  brand: { type: String, required: false },
  weight: { type: Number, required: false },
  shape: { type: String, required: false },
  dimension: {
    width: { type: Number, required: false },
    height: { type: Number, required: false },
  },
  color: [{ type: String, required: false }],
  material: { type: String, required: false },
  size: [{ type: String, required: false }],
  customOrder: { type: Boolean, required: false },
  tags: [{ type: String, required: false }],
  createdAt: { type: Date, default: Date.now },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  productPolicy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ShopPolicy",
    required: false,
  },
  shipping: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ShopShippingPolicy",
    required: false,
  },
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
      price: { type: Number, required: true },
      weight: { type: Number, required: false },
      color: { type: String, required: false },
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
