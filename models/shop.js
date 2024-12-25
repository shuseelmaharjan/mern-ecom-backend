const mongoose = require('mongoose');

const ShopSchema = new mongoose.Schema({
    shopName: { type: String, required: true },
    ownerName: { type: String, required: false , null: true},
    shopLogo: { type: String, required: false },
    shopDescription: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    createdDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: null },
    isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model('Shop', ShopSchema);
