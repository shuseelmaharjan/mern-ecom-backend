const mongoose = require('mongoose');

// Define Media Schema
const MediaSchema = new mongoose.Schema({
    images: [
        {
            url: { type: String, required: true },
            primary: { type: Boolean, default: false },
        }
    ],
    video: {
        url: { type: String, required: false},
    }
});

// Define Variants Schema
const VariantSchema = new mongoose.Schema({
    enabled: { type: Boolean, required: true },
    colors: {
        enabled: { type: Boolean, default: false },
        values: [
            {
                code: { type: String },
                name: { type: String },
            }
        ],
    },
    sizes: {
        enabled: { type: Boolean, default: false },
        values: [{ name: { type: String, required: false } }]
    }
    
});

// Define Shipping Services Schema
const ShippingServiceSchema = new mongoose.Schema({
    national: {
        freeShipping: { type: Boolean, default: false },
        fixedShipping: {
            costOfDelivery: { type: Number },
        },
    },
    international: {
        freeShipping: { type: Boolean, default: false },
        fixedShipping: {
            costOfDelivery: { type: Number },
        },
    }
});

// Define Shipping Origin Schema
const ShippingOriginSchema = new mongoose.Schema({
    processingTime: { type: String },
    services: ShippingServiceSchema,
});

// Define Return and Exchange Schema
const ReturnExchangeSchema = new mongoose.Schema({
    enabled: { type: Boolean, required: true },
    details: {
        returnEnabled: { type: Boolean },
        exchangeEnabled: { type: Boolean },
        returnDays: { type: Number },
    },
});

const ProductSchema = new mongoose.Schema({
    title: { type: String, required: true },
    media: MediaSchema,
    description: { type: String },
    summary: { type: String },
    personalization: {
        enabled: { type: Boolean, required: true },
        productLimit: { type: Number },
    },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    SKU: { type: String, required: false, unique: true },
    variants: VariantSchema,
    tags: [{ type: String }],
    materials: [{ type: String }],
    shippingOrigin: ShippingOriginSchema,
    returnAndExchange: ReturnExchangeSchema,
    renewal: { type: Boolean, default: false },
    expirationDate: { type: Date },
    expired: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Product', ProductSchema);
