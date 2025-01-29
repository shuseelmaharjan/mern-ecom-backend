const Product = require("../models/product");
const FileService = require("../services/fileService");

class FileController {
  static async updateProduct(req, res) {
    try {
      const { productId } = req.params;
      const {
        haveVariations,
        price,
        weight,
        color,
        hasUniquePrice,
        hasUniqueWeight,
        hasUniqueStock,
        stock,
      } = req.body;
      const files = req.files || [];

      console.log(`Received files: ${files.length}`);
      files.forEach((file) =>
        console.log(
          `File MIME Type: ${file.mimetype}, File Name: ${file.originalname}`
        )
      );

      let product = await Product.findById(productId);
      if (!product) {
        console.error(`Product not found: ${productId}`);
        return res.status(404).json({ message: "Product not found" });
      }

      let media = await FileService.saveMedia(files);

      product.haveVariations = haveVariations === "true";
      product.variations.push({
        sku: `VAR-${Date.now()}`,
        hasUniquePrice: hasUniquePrice === "true",
        price: hasUniquePrice === "true" ? parseFloat(price) : null,
        hasUniqueWeight: hasUniqueWeight === "true",
        weight: hasUniqueWeight === "true" ? parseFloat(weight) : null,
        color: color || null,
        hasUniqueStock: hasUniqueStock === "true",
        stock: hasUniqueStock === "true" ? parseInt(stock, 10) : null,
        media: { images: media.images, video: media.video },
        isDefault: product.variations.length === 0,
      });

      await product.save();
      res
        .status(200)
        .json({ message: "Product updated successfully", product });
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: error.message });
    }
  }

  static async updateVariation(req, res) {
    try {
      const { productId, variationId } = req.params;
      const {
        haveVariations,
        price,
        weight,
        color,
        hasUniquePrice,
        hasUniqueWeight,
        hasUniqueStock,
        stock,
      } = req.body;
      const files = req.files || [];
      const indexes = Array.isArray(req.body.indexes)
        ? req.body.indexes.map(Number)
        : [];
      const existingFiles = req.body.existingFiles
        ? JSON.parse(req.body.existingFiles)
        : [];

      console.log(`Received files: ${files.length}`);
      files.forEach((file) =>
        console.log(
          `File MIME Type: ${file.mimetype}, File Name: ${file.originalname}`
        )
      );

      let product = await Product.findById(productId);
      if (!product) {
        console.error(`Product not found: ${productId}`);
        return res.status(404).json({ message: "Product not found" });
      }

      let variation = product.variations.id(variationId);
      if (!variation) {
        console.error(`Variation not found: ${variationId}`);
        return res.status(404).json({ message: "Variation not found" });
      }

      // Save new media files
      let newMedia = await FileService.saveMedia(files);

      // Merge new media with existing media
      let updatedImages = [...existingFiles];
      let updatedVideo = variation.media.video;

      // Add new images to the existing images array based on indexes
      indexes.forEach((index, idx) => {
        if (newMedia.images[idx]) {
          updatedImages[index] = newMedia.images[idx];
        }
      });

      // Check if new video is provided
      if (newMedia.video) {
        updatedVideo = newMedia.video;
      }

      // Filter out any null values from the updatedImages array
      updatedImages = updatedImages.filter((image) => image !== null);

      variation.hasUniquePrice = hasUniquePrice === "true";
      variation.price = hasUniquePrice === "true" ? parseFloat(price) : null;
      variation.hasUniqueWeight = hasUniqueWeight === "true";
      variation.weight = hasUniqueWeight === "true" ? parseFloat(weight) : null;
      variation.color = color || variation.color;
      variation.hasUniqueStock = hasUniqueStock === "true";
      variation.stock = hasUniqueStock === "true" ? parseInt(stock, 10) : null;
      variation.media = { images: updatedImages, video: updatedVideo };

      await product.save();
      res
        .status(200)
        .json({ message: "Variation updated successfully", product });
    } catch (error) {
      console.error("Error updating variation:", error);
      res.status(500).json({ message: error.message });
    }
  }

  static async getVariation(req, res) {
    try {
      const { productId, variationId } = req.params;

      let product = await Product.findById(productId);
      if (!product) {
        console.error(`Product not found: ${productId}`);
        return res.status(404).json({ message: "Product not found" });
      }

      let variation = product.variations.id(variationId);
      if (!variation) {
        console.error(`Variation not found: ${variationId}`);
        return res.status(404).json({ message: "Variation not found" });
      }

      res.status(200).json({ variation });
    } catch (error) {
      console.error("Error fetching variation:", error);
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = FileController;
