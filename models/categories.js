const mongoose = require('mongoose');

const GrandCategorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, trim: true, lowercase: true },
});

const SubCategorySchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, lowercase: true },
    grandCategories: [GrandCategorySchema],
});

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, trim: true, lowercase: true },
    subCategories: [SubCategorySchema], 
});

const CatalogSchema = new mongoose.Schema({
    action: { type: String, required: true, enum: ['CREATE', 'UPDATE', 'DELETE'] },
    modelAffected: { type: String, required: true, enum: ['Category', 'SubCategory', 'GrandCategory'] },
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true }, 
    timestamp: { type: Date, default: Date.now },
    details: { type: String }, 
});

const Category = mongoose.model('Category', CategorySchema);
const Catalog = mongoose.model('Catalog', CatalogSchema);

module.exports = { Category, Catalog };
