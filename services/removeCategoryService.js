const { Category, Catalog } = require("../models/categories");
const mongoose = require("mongoose");

class RemoveCategoryService {
  async updateCategory(userId, categoryId) {
    const category = await Category.findById(categoryId);
    if (!category) throw new Error("Category not found");

    category.isActive = false;
    await category.save();

    await this.logCatalog(
      "DELETE",
      "Category",
      userId,
      `Category ${category.name} marked inactive`
    );
    return category;
  }

  async updateSubCategory(userId, parentId, subId) {
    const category = await Category.findById(parentId);
    if (!category) throw new Error("Parent Category not found");

    const subCategory = category.subCategories.id(subId);
    if (!subCategory) throw new Error("SubCategory not found");

    subCategory.isActive = false;
    await category.save();

    await this.logCatalog(
      "DELETE",
      "SubCategory",
      userId,
      `SubCategory ${subCategory.name} marked inactive`
    );
    return subCategory;
  }

  async updateGrandCategory(userId, parentId, subId, grandId) {
    const category = await Category.findById(parentId);
    if (!category) throw new Error("Parent Category not found");

    const subCategory = category.subCategories.id(subId);
    if (!subCategory) throw new Error("SubCategory not found");

    const grandCategory = subCategory.grandCategories.id(grandId);
    if (!grandCategory) throw new Error("GrandCategory not found");

    grandCategory.isActive = false;
    await category.save();

    await this.logCatalog(
      "DELETE",
      "GrandCategory",
      userId,
      `GrandCategory ${grandCategory.name} marked inactive`
    );
    return grandCategory;
  }

  async logCatalog(action, modelAffected, userId, details) {
    const catalogEntry = new Catalog({
      action,
      modelAffected,
      performedBy: userId,
      performedAt: new mongoose.Types.ObjectId(),
      details,
    });
    await catalogEntry.save();
  }
}

module.exports = new RemoveCategoryService();
