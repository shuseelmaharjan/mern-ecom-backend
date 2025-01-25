const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const sizeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const colorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const materialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Brand = mongoose.model("Brand", brandSchema);
const Size = mongoose.model("Size", sizeSchema);
const Color = mongoose.model("Color", colorSchema);
const Material = mongoose.model("Material", materialSchema);

module.exports = { Brand, Size, Color, Material };
