const mongoose = require("mongoose");

const MediaSchema = new mongoose.Schema({
  images: [
    {
      url: { type: String, required: false },
    },
  ],
});

const dimensionSchema = new mongoose.Schema({
  width: { type: Number, required: false },
  height: { type: Number, required: false },
});

const ColorSchema = new mongoose.Schema({
  code: { type: String, required: false },
  name: { type: String, required: false },
});

// Define Shipping Origin Schema
const shippingSchema = new mongoose.Schema({
  service: { type: Boolean, required: true },
  processingTime: { type: String },
  freeShipping: { type: Boolean, default: false },
  cod: { type: Number },
});

const internationalShippingSchema = new mongoose.Schema({
  service: { type: Boolean, required: true },
  processingTime: { type: String },
  freeShipping: { type: Boolean, default: false },
  cod: { type: Number },
});

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  media: MediaSchema,
  thumbnail: { type: String, required: true },
  video: { type: String, required: false },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  productLimit: { type: Number, required: false },
  brand: { type: String, required: false },
  weight: { type: Number, required: false },
  dimension: dimensionSchema,
  sku: { type: String, required: false, sparse: true },
  colors: [ColorSchema],
  size: [{ type: String, required: false }],
  tags: [{ type: String, required: false }],
  materials: [{ type: String, required: false }],
  shipping: shippingSchema,
  internationalShipping: internationalShippingSchema,
  returnAndExchange: [
    {
      days: { type: Number, required: false, default: null },
      description: { type: String, required: false, default: null },
    },
  ],
  renewal: { type: Boolean, default: false },
  expDate: { type: Date },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Product", ProductSchema);
