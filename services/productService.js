const Product = require("../models/product");
const {
  ShopShippingPolicy,
  ShopReturnPolicy,
  CompanyReturnPolicy,
  CompanyShippingPolicy,
} = require("../models/shop");

class ProductService {
  async createProduct(product, userId) {
    const { title, category } = product;
    try {
      const newProduct = new Product({
        title,
        category,
        createdBy: userId,
      });
      await newProduct.save();
      return newProduct;
    } catch (err) {
      throw new Error(err);
    }
  }
  async getProductDetails(productId) {
    try {
      const response = await Product.findById(productId);
      return response;
    } catch (err) {
      throw new Error(err);
    }
  }

  async getDimensions(productId) {
    try {
      const response = await Product.findById(
        productId,
        "hasDimension dimension"
      );
      return response;
    } catch (err) {
      throw new Error(err);
    }
  }

  async updateHasDimension(productId, hasDimension) {
    try {
      const response = await Product.findByIdAndUpdate(
        productId,
        { hasDimension },
        { new: true }
      );
      return response;
    } catch (err) {
      throw new Error(err);
    }
  }

  async addDimension(productId, dimension) {
    const { height, width } = dimension;
    try {
      const response = await Product.findByIdAndUpdate(
        productId,
        { dimension: { height, width } },
        { new: true }
      );
      return response;
    } catch (err) {
      throw new Error(err);
    }
  }

  async getColor(productId) {
    try {
      const response = await Product.findById(productId, "hasColor color");
      if (!response) {
        return { hasColor: false, colors: [] };
      }

      return {
        hasColor: response.hasColor,
        colors: response.color,
      };
    } catch (err) {
      throw new Error(err.message || "Error fetching colors");
    }
  }

  async updateHasColor(productId, hasColor) {
    try {
      const response = await Product.findByIdAndUpdate(
        productId,
        { hasColor },
        { new: true }
      );
      return response;
    } catch (err) {
      throw new Error(err);
    }
  }

  async addColor(productId, color) {
    try {
      if (typeof color !== "string") {
        throw new Error("Color must be a string");
      }

      const lowerCaseColor = color.toLowerCase();

      const response = await Product.findByIdAndUpdate(
        productId,
        { $push: { color: lowerCaseColor } },
        { new: true }
      );
      return response;
    } catch (err) {
      throw new Error(err.message || "Error adding color");
    }
  }

  async removeColor(productId, color) {
    try {
      if (typeof color !== "string") {
        throw new Error("Color must be a string");
      }

      const response = await Product.findByIdAndUpdate(
        productId,
        { $pull: { color: color } },
        { new: true }
      );
      return response;
    } catch (err) {
      throw new Error(err.message || "Error removing color");
    }
  }

  async getSize(productId) {
    try {
      const response = await Product.findById(productId, "hasSize size");
      if (!response) {
        return { hasSize: false, size: [] };
      }

      return {
        hasSize: response.hasSize,
        size: response.size,
      };
    } catch (err) {
      throw new Error(err.message || "Error fetching size");
    }
  }

  async updateHasSize(productId, hasSize) {
    try {
      const response = await Product.findByIdAndUpdate(
        productId,
        { hasSize },
        { new: true }
      );
      return response;
    } catch (err) {
      throw new Error(err);
    }
  }

  async addSize(productId, size) {
    try {
      if (typeof size !== "string") {
        throw new Error("Size must be a string");
      }

      const lowerCaseSize = size.toLowerCase();

      const response = await Product.findByIdAndUpdate(
        productId,
        { $push: { size: lowerCaseSize } },
        { new: true }
      );
      return response;
    } catch (err) {
      throw new Error(err.message || "Error adding size");
    }
  }

  async removeSize(productId, size) {
    try {
      if (typeof size !== "string") {
        throw new Error("Size must be a string");
      }

      const response = await Product.findByIdAndUpdate(
        productId,
        { $pull: { size: size } },
        { new: true }
      );
      return response;
    } catch (err) {
      throw new Error(err.message || "Error removing size");
    }
  }

  async getTags(productId) {
    try {
      const response = await Product.findById(productId, "tags");

      return {
        tags: response.tags,
      };
    } catch (err) {
      throw new Error(err.message || "Error fetching tags");
    }
  }

  async addTags(productId, tags) {
    try {
      if (typeof tags !== "string") {
        throw new Error("Tags must be a string");
      }

      const lowerCaseTag = tags.toLowerCase();

      const response = await Product.findByIdAndUpdate(
        productId,
        { $push: { tags: lowerCaseTag } },
        { new: true }
      );

      if (!response) {
        throw new Error("Product not found");
      }

      return response;
    } catch (err) {
      console.error("Error:", err.message);
      throw new Error(err.message || "Error adding tag");
    }
  }

  async removeTags(productId, tags) {
    try {
      if (typeof tags !== "string") {
        throw new Error("Tags must be a string");
      }

      const response = await Product.findByIdAndUpdate(
        productId,
        { $pull: { tags: tags } },
        { new: true }
      );
      return response;
    } catch (err) {
      throw new Error(err.message || "Error removing size");
    }
  }

  async updateProductDetails(productId, product) {
    const {
      title,
      description,
      price,
      quantity,
      productLimit,
      brand,
      weight,
      shape,
      material,
      customOrder,
      hasDimension,
      dimension,
    } = product;

    try {
      const response = await Product.findByIdAndUpdate(
        productId,
        {
          title,
          description,
          price,
          quantity,
          productLimit,
          brand,
          weight,
          shape,
          material,
          customOrder,
          hasDimension,
          dimension,
        },
        { new: true }
      );
      return response;
    } catch (err) {
      throw new Error(err);
    }
  }

  async getProductVariations(productId) {
    try {
      const response = await Product.findById(
        productId,
        "haveVariations variations"
      );
      if (!response) {
        return { haveVariations: false, variations: [] };
      }

      return {
        haveVariations: response.haveVariations,
        variations: response.variations,
      };
    } catch (err) {
      throw new Error(err.message || "Error fetching variations");
    }
  }

  async updateHaveVariations(productId, haveVariations) {
    try {
      const response = await Product.findByIdAndUpdate(
        productId,
        { haveVariations },
        { new: true }
      );
      return response;
    } catch (err) {
      throw new Error(err);
    }
  }

  async deleteVariations(productId, variationIds) {
    try {
      let product = await Product.findById(productId);
      if (!product) {
        console.error(`Product not found: ${productId}`);
        return false;
      }

      let updatedVariations = product.variations.filter(
        (variation) => !variationIds.includes(variation._id.toString())
      );

      if (updatedVariations.length === product.variations.length) {
        console.error(`No variations found for IDs: ${variationIds}`);
        return false;
      }

      product.variations = updatedVariations;
      await product.save();
      return true;
    } catch (err) {
      console.error("Error deleting variations:", err);
      return false;
    }
  }

  async productPolicy(productId, userId) {
    try {
      const product = await Product.findById(
        productId,
        "defaultShipping shipping defaultReturnPolicy returnPolicy"
      );

      if (!product) {
        throw new Error("Product not found");
      }

      let shippingPolicy = null;
      let returnPolicy = null;

      if (product.defaultShipping) {
        shippingPolicy = true;
      } else {
        if (product.shipping) {
          shippingPolicy = await ShopShippingPolicy.findOne({
            _id: product.shipping,
            isActive: true,
          });
        } else {
          shippingPolicy = await ShopShippingPolicy.findOne({
            userId,
            isDefault: true,
            isActive: true,
          });
        }
      }

      if (product.defaultReturnPolicy) {
        returnPolicy = true;
      } else {
        if (product.returnPolicy) {
          returnPolicy = await ShopReturnPolicy.findOne({
            _id: product.returnPolicy,
            isActive: true,
          });
        } else {
          returnPolicy = await ShopReturnPolicy.findOne({
            userId,
            isDefault: true,
            isActive: true,
          });
        }
      }

      return {
        productId,
        defaultShipping: shippingPolicy === true,
        shippingPolicy: shippingPolicy !== true ? shippingPolicy : undefined,
        defaultReturnPolicy: returnPolicy === true,
        returnPolicy: returnPolicy !== true ? returnPolicy : undefined,
      };
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async updateProductPolicy(productId, policy) {
    try {
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error("Product not found");
      }

      if (policy.defaultReturnPolicy) {
        product.defaultReturnPolicy = true;
        product.returnPolicy = null;
      } else {
        product.defaultReturnPolicy = false;
        product.returnPolicy = policy.returnPolicy;
      }

      await product.save();
      return product;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async updateProductShippingPolicy(productId, policy) {
    try {
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error("Product not found");
      }

      if (policy.defaultShipping) {
        product.defaultShipping = true;
        product.shipping = null;
      } else {
        product.defaultShipping = false;
        product.shipping = policy.shippingPolicy;
      }

      await product.save();
      return product;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = new ProductService();
