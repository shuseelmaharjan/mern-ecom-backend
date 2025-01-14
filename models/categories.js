const mongoose = require("mongoose");

const GrandCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    lowercase: true,
    required: false,
  },
  image: { type: String, required: false },
  isActive: { type: Boolean, default: true },
});

const SubCategorySchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  }, // Use `new`
  name: {
    type: String,
    trim: true,
    lowercase: true,
    required: false,
  },
  image: { type: String, required: false },
  isActive: { type: Boolean, default: true },
  grandCategories: [GrandCategorySchema],
});

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: true,
  },
  image: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  subCategories: [SubCategorySchema],
});

const CatalogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    enum: ["INSERT", "UPDATE", "DELETE"],
  },
  modelAffected: {
    type: String,
    required: true,
    enum: ["Category", "SubCategory", "GrandCategory"],
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  performedAt: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  details: { type: String },
  timestamp: { type: Date, default: Date.now },
});

const Category = mongoose.model("Category", CategorySchema);
const Catalog = mongoose.model("Catalog", CatalogSchema);

module.exports = { Category, Catalog };
