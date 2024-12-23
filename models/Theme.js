const mongoose = require('mongoose');

const ThemeAndLogoSchema = new mongoose.Schema(
    {
        primaryColor: {
            type: String,
            required: true,
            default: '#000000', // Default black
            match: /^#([0-9A-F]{3}|[0-9A-F]{6})$/i,
        },
        secondaryColor: {
            type: String,
            required: true,
            default: '#808080', // Default gray
            match: /^#([0-9A-F]{3}|[0-9A-F]{6})$/i,
        },
        buttonColor: {
            type: String,
            required: true,
            default: '#000000', // Default black
            match: /^#([0-9A-F]{3}|[0-9A-F]{6})$/i,
        },
        hoverButtonColor: {
            type: String,
            required: true,
            default: '#808080', // Default gray
            match: /^#([0-9A-F]{3}|[0-9A-F]{6})$/i,
        },
        backgroundColor: {
            type: String,
            required: true,
            default: '#FFFFFF', // Default white
            match: /^#([0-9A-F]{3}|[0-9A-F]{6})$/i,
        },

        // Logo-related fields
        logo: {
            logoImage: {
                type: String, 
                trim: true,
                default: null,
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
            updatedAt: {
                type: Date,
            },
        },

        // Main timestamps
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

ThemeAndLogoSchema.pre('save', async function (next) {
    const ThemeAndLogo = mongoose.model('ThemeAndLogo', ThemeAndLogoSchema);

    const count = await ThemeAndLogo.countDocuments();
    if (count > 0 && this.isNew) {
        throw new Error('Only one instance of ThemeAndLogo is allowed.');
    }

    this.updatedAt = new Date();
    if (this.isModified('logo')) {
        this.logo.updatedAt = new Date();
    }

    next();
});

module.exports = mongoose.model('ThemeAndLogo', ThemeAndLogoSchema);
