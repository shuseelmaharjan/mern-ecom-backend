const { Category, Catalog } = require("../models/categories");

class CategoryUpdateService {
  async updateCategory(userId, catId, updateData) {
    const { name, image } = updateData;

    try {
      const existingCategory = await Category.findById(catId);
      if (!existingCategory) {
        throw new Error("Category not found");
      }

      const updatedCategory = await Category.findByIdAndUpdate(
        catId,
        { name, image },
        { new: true }
      );

      if (!updatedCategory) {
        throw new Error("Category update failed");
      }

      await Catalog.create({
        action: "UPDATE",
        modelAffected: "Category",
        performedBy: userId,
        performedAt: updatedCategory._id,
        details: `Updated category from name: ${
          existingCategory.name
        } to name: ${name || "unknown"}`,
      });

      return updatedCategory;
    } catch (error) {
      throw new Error(`Failed to update Category: ${error.message}`);
    }
  }

  static async updateSubCategory(id, updateData, performedBy, details) {
    try {
      const updatedSubCategory = await Category.findOneAndUpdate(
        { "subCategories._id": id },
        { $set: { "subCategories.$": updateData } },
        { new: true }
      );
      if (!updatedSubCategory) throw new Error("SubCategory not found");

      await this.logUpdateToCatalog(
        "UPDATE",
        "SubCategory",
        performedBy,
        id,
        details
      );
      return updatedSubCategory;
    } catch (error) {
      throw new Error(`Failed to update SubCategory: ${error.message}`);
    }
  }

  static async updateGrandCategory(id, updateData, performedBy, details) {
    try {
      const updatedGrandCategory = await Category.findOneAndUpdate(
        { "subCategories.grandCategories._id": id },
        { $set: { "subCategories.$.grandCategories.$": updateData } },
        { new: true }
      );
      if (!updatedGrandCategory) throw new Error("GrandCategory not found");

      await this.logUpdateToCatalog(
        "UPDATE",
        "GrandCategory",
        performedBy,
        id,
        details
      );
      return updatedGrandCategory;
    } catch (error) {
      throw new Error(`Failed to update GrandCategory: ${error.message}`);
    }
  }
}

module.exports = new CategoryUpdateService();
