const Product = require('../models/product');

class ProductService {
    async createProduct(productData) {
        try {
            const product = new Product(productData);
            await product.save();
            return { success: true, product };
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getProductById(productId) {
        try {
            const product = await Product.findById(productId);
            if (!product) {
                throw new Error('Product not found');
            }
            return product;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateProduct(productId, updatedData) {
        try {
            const product = await Product.findByIdAndUpdate(productId, updatedData, { new: true });
            if (!product) {
                throw new Error('Product not found');
            }
            return { success: true, product };
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async deleteProduct(productId) {
        try {
            const product = await Product.findByIdAndDelete(productId);
            if (!product) {
                throw new Error('Product not found');
            }
            return { success: true };
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getProductsByUser(userId) {
        try {
            const products = await Product.find({ createdBy: userId });
            return products;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = ProductService;
