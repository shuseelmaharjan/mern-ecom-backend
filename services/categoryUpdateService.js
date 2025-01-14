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

  async updateSubCategory(userId, catId, subCatId, updateData) {
    const { name, image } = updateData;

    try {
      const category = await Category.findById(catId);
      if (!category) throw new Error("Parent category not found");

      const subCategory = category.subCategories.id(subCatId);
      if (!subCategory) throw new Error("Subcategory not found");

      if (name) subCategory.name = name;
      if (image) subCategory.image = image;

      const updatedCategory = await category.save();

      await Catalog.create({
        action: "UPDATE",
        modelAffected: "SubCategory",
        performedBy: userId,
        performedAt: subCategory._id,
        details: `Updated subcategory to name: ${name || "unchanged"}`,
      });

      return subCategory;
    } catch (error) {
      throw new Error(`Failed to update SubCategory: ${error.message}`);
    }
  }

  async updateGrandCategory(userId, catId, subCatId, grandCatId, updateData) {
    const { name, image } = updateData;

    try {
      const category = await Category.findById(catId);
      if (!category) throw new Error("Parent category not found");

      const subCategory = category.subCategories.id(subCatId);
      if (!subCategory) throw new Error("Subcategory not found");

      const grandCategory = subCategory.grandCategories.id(grandCatId);
      if (!grandCategory) throw new Error("Grand category not found");

      if (name) grandCategory.name = name;
      if (image) grandCategory.image = image;

      const updatedCategory = await category.save();

      await Catalog.create({
        action: "UPDATE",
        modelAffected: "GrandCategory",
        performedBy: userId,
        performedAt: grandCategory._id,
        details: `Updated grand category to name: ${name || "unchanged"}`,
      });

      return grandCategory;
    } catch (error) {
      throw new Error(`Failed to update GrandCategory: ${error.message}`);
    }
  }
}

module.exports = new CategoryUpdateService();
