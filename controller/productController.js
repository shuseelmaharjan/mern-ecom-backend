const ProductService = require('../services/productService');

class ProductController {
    constructor() {
        this.productService = new ProductService();
    }

    // Create new product
    async create(req, res) {
        try {
            const productData = req.body;
            productData.createdBy = req.user.id;

            const result = await this.productService.createProduct(productData);
            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    // Update an existing product
    async update(req, res) {
        try {
            const productId = req.params.id;
            const updatedData = req.body;

            // Ensure the product belongs to the current user
            const product = await this.productService.getProductById(productId);
            if (product.createdBy.toString() !== req.user.id) {
                return res.status(403).json({ message: 'You are not authorized to update this product' });
            }

            const result = await this.productService.updateProduct(productId, updatedData);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    // Delete an existing product
    async delete(req, res) {
        try {
            const productId = req.params.id;

            // Ensure the product belongs to the current user
            const product = await this.productService.getProductById(productId);
            if (product.createdBy.toString() !== req.user.id) {
                return res.status(403).json({ message: 'You are not authorized to delete this product' });
            }

            await this.productService.deleteProduct(productId);
            res.status(200).json({ message: 'Product deleted successfully' });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    // List all products for the current user
    async list(req, res) {
        try {
            const products = await this.productService.getProductsByUser(req.user.id);
            res.status(200).json(products);
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
}

module.exports = new ProductController();
