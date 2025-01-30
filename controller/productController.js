const productService = require("../services/productService");
const GetUserId = require("../helper/getUserId");

class ProductController {
  async createProduct(req, res) {
    const getUserId = new GetUserId(req);
    const userId = await getUserId.getUserId();
    try {
      const product = req.body;
      const newProduct = await productService.createProduct(product, userId);
      res.status(201).json(newProduct);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
  async getProductDetails(req, res) {
    const productId = req.params.id;
    try {
      const product = await productService.getProductDetails(productId);
      res.status(200).json(product);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async getDimensions(req, res) {
    try {
      const productId = req.params.id;
      const dimensions = await productService.getDimensions(productId);
      res.status(200).json(dimensions);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async updateHasDimension(req, res) {
    const productId = req.params.id;
    const hasDimension = req.body.hasDimension;
    try {
      const updatedProduct = await productService.updateHasDimension(
        productId,
        hasDimension
      );
      res.status(200).json(updatedProduct);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async addDimension(req, res) {
    const productId = req.params.id;
    const dimension = req.body;
    try {
      const updatedProduct = await productService.addDimension(
        productId,
        dimension
      );
      res.status(200).json(updatedProduct);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async getColors(req, res) {
    try {
      const productId = req.params.id;
      const colors = await productService.getColor(productId);
      res.status(200).json(colors);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async updateHasColor(req, res) {
    const productId = req.params.id;
    const hasColor = req.body.hasColor;
    try {
      const updatedProduct = await productService.updateHasColor(
        productId,
        hasColor
      );
      res.status(200).json(updatedProduct);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
  async addColor(req, res) {
    const productId = req.params.id;
    const color = req.body.color;
    try {
      const updatedProduct = await productService.addColor(productId, color);
      res.status(200).json(updatedProduct);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async removeColor(req, res) {
    const productId = req.params.id;
    const color = req.body.color;

    try {
      const updatedProduct = await productService.removeColor(productId, color);
      res.status(200).json(updatedProduct);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async getSize(req, res) {
    try {
      const productId = req.params.id;
      const size = await productService.getSize(productId);
      res.status(200).json(size);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async updateHasSize(req, res) {
    const productId = req.params.id;
    const hasSize = req.body.hasSize;
    try {
      const updateSize = await productService.updateHasSize(productId, hasSize);
      res.status(200).json(updateSize);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
  async addSize(req, res) {
    const productId = req.params.id;
    const size = req.body.size;
    try {
      const updateSize = await productService.addSize(productId, size);
      res.status(200).json(updateSize);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async removeSize(req, res) {
    const productId = req.params.id;
    const size = req.body.size;

    try {
      const updateSize = await productService.removeSize(productId, size);
      res.status(200).json(updateSize);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async getTags(req, res) {
    try {
      const productId = req.params.id;
      const tag = await productService.getTags(productId);
      res.status(200).json(tag);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async addTags(req, res) {
    const productId = req.params.id;
    const tags = req.body.tags;
    try {
      const updateTags = await productService.addTags(productId, tags);
      res.status(200).json(updateTags);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async removeTags(req, res) {
    const productId = req.params.id;
    const tags = req.body.tags;

    try {
      const updateTags = await productService.removeTags(productId, tags);
      res.status(200).json(updateTags);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async updateProductDetails(req, res) {
    const productId = req.params.id;
    const product = req.body;
    console.log(product);
    try {
      const updatedProduct = await productService.updateProductDetails(
        productId,
        product
      );
      res.status(200).json(updatedProduct);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async getProductVariations(req, res) {
    const productId = req.params.id;
    try {
      const getProductVariations = await productService.getProductVariations(
        productId
      );
      res.status(200).json(getProductVariations);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateHaveVariations(req, res) {
    const productId = req.params.id;
    const haveVariations = req.body.haveVariations;
    try {
      const updatedProduct = await productService.updateHaveVariations(
        productId,
        haveVariations
      );
      res.status(200).json(updatedProduct);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async removeProductVariation(req, res) {
    console.log(req);
    try {
      const { productId, variationIds } = req.params;
      const variationIdsArray = variationIds.split(",");

      const success = await productService.deleteVariations(
        productId,
        variationIdsArray
      );

      if (success) {
        return res
          .status(200)
          .json({ message: "Variation removed successfully" });
      } else {
        return res
          .status(404)
          .json({ message: "Product or variation not found" });
      }
    } catch (error) {
      console.error("Error removing variation:", error);
      return res.status(500).json({ message: error.message });
    }
  }

  async productPolicy(req, res) {
    const getUserId = new GetUserId(req);
    const userId = await getUserId.getUserId();
    try {
      const productId = req.params.productId;
      const policy = await productService.productPolicy(productId, userId);
      res.status(200).json(policy);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
  async updateProductPolicy(req, res) {
    try {
      const { productId } = req.params;
      const policy = req.body;

      const updatedPolicy = await productService.updateProductPolicy(
        productId,
        policy
      );

      return res.status(200).json({ success: true, data: updatedPolicy });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
  async updateProductShippingPolicy(req, res) {
    try {
      const { productId } = req.params;
      const policy = req.body;
      const updatedPolicy = await productService.updateProductShippingPolicy(
        productId,
        policy
      );
      return res.status(200).json({ success: true, data: updatedPolicy });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getVendorProducts(req, res) {
    try {
      const { sort, isActive, isDraft } = req.params;
      const getUserId = new GetUserId(req);
      const userId = await getUserId.getUserId();

      const filters = {
        isActive: isActive === "true",
        isDraft: isDraft === "true",
      };

      const products = await productService.getVendorProducts(
        filters,
        sort,
        userId
      );
      res.json(products);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = new ProductController();
