const mongoose = require("mongoose");

const MediaSchema = new mongoose.Schema({
  images: [
    {
      url: { type: String, required: false },
      default: { type: Boolean, default: false },
    },
  ],
});

const dimensionDetailsSchema = new mongoose.Schema({
  width: { type: Number, required: false, default: null },
  height: { type: Number, required: false, default: null },
});

const dimensionSchema = new mongoose.Schema({
  isEnabled: { type: Boolean, required: true, default: false },
  details: {
    type: dimensionDetailsSchema,
    required: false,
    default: null,
  },
});

const colorSchema = new mongoose.Schema({
  isEnabled: { type: Boolean, required: true, default: false },
  details: [
    {
      code: { type: String, required: false, default: null },
      name: { type: String, required: false, default: null },
    },
  ],
});

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
  video: { type: String, required: false },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  productLimit: { type: Number, required: false },
  brand: { type: String, required: false },
  weight: { type: Number, required: false },
  dimension: dimensionSchema,
  sku: { type: String, required: false },
  colors: colorSchema,
  size: [{ type: String, required: false }],
  tags: [{ type: String, required: false }],
  materials: [{ type: String, required: false }],
  shipping: shippingSchema,
  internationalShipping: internationalShippingSchema,
  returnAndExchange: {
    isEnabled: { type: Boolean, required: true, default: false },
    details: {
      type: {
        days: { type: Number, required: false, default: null },
        description: { type: String, required: false, default: null },
      },
      required: function () {
        return this.isEnabled;
      },
      default: null,
    },
  },
  renewal: { type: Boolean, default: false },
  expDate: { type: Date },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  views: { type: Number, default: 0 },

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
});

module.exports = mongoose.model("Product", ProductSchema);
