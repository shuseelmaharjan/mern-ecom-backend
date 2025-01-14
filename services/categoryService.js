const { Category, Catalog } = require("../models/categories");

class CategoryService {
  async createCategory(data, userId) {
    const { name, image } = data;
    const existingCategory = await Category.findOne({ name, isActive: true });
    if (existingCategory) {
      throw new Error("An active category with the same name already exists.");
    }

    try {
      const newCategory = new Category({
        name: name,
        image: image,
        subCategories: [],
      });

      await newCategory.save();

      await Catalog.create({
        action: "INSERT",
        modelAffected: "Category",
        performedBy: userId,
        performedAt: newCategory._id,
        details: `Created category with name: ${name}`,
      });

      return newCategory;
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  async addSubCategory(categoryId, data, userId) {
    const { name, image } = data;

    const category = await Category.findById(categoryId);
    if (!category) {
      throw new Error("Category not found.");
    }

    const existingSubCategory = category.subCategories.find(
      (sub) => sub.name === name && sub.isActive
    );

    if (existingSubCategory) {
      throw new Error(
        "An active subcategory with the same name already exists."
      );
    }

    const newSubCategory = {
      name,
      image,
      grandCategories: [],
      isActive: true,
    };

    category.subCategories.push(newSubCategory);
    await category.save();

    const subCategory = category.subCategories.find((sub) => sub.name === name);

    const catalogEntry = await Catalog.create({
      action: "INSERT",
      modelAffected: "SubCategory",
      performedBy: userId,
      performedAt: subCategory._id,
      details: `Created subcategory with name: ${name} in category: ${category.name}`,
    });

    return {
      ...newSubCategory,
      activity: catalogEntry,
    };
  }

  async addGrandCategory(categoryId, subCategoryId, grandCategoryData, userId) {
    const { name, image } = grandCategoryData;

    if (!name || name.trim() === "") {
      throw new Error("Grandcategory name cannot be null or empty.");
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      throw new Error("Parent category not found.");
    }

    const subCategory = category.subCategories.id(subCategoryId);
    if (!subCategory) {
      throw new Error("Parent subcategory not found.");
    }

    if (
      subCategory.grandCategories.some(
        (grand) => grand.name === name && grand.isActive
      )
    ) {
      throw new Error(
        "An active grandcategory with the same name already exists."
      );
    }

    const newGrandCategory = { name, image, isActive: true };
    subCategory.grandCategories.push(newGrandCategory);
    await category.save();

    const grandCategory = subCategory.grandCategories.find(
      (grand) => grand.name === name
    );

    const catalogEntry = await Catalog.create({
      action: "INSERT",
      modelAffected: "GrandCategory",
      performedBy: userId,
      performedAt: grandCategory._id,
      details: `Added grandcategory ${name} to subcategory ID: ${subCategoryId} in category ID: ${categoryId}`,
    });

    return {
      ...grandCategory.toObject(),
      activity: catalogEntry,
    };
  }

  async getAllCategory() {
    try {
      const data = await Category.find({ isActive: true })
        .populate("subCategories.grandCategories")
        .exec();
      return data;
    } catch (error) {
      throw new Error("Error getting categories lists" + error.message);
    }
  }

  async getCategory() {
    try {
      const categories = await Category.find({ isActive: true }).exec();

      const activities = await Catalog.find({
        modelAffected: { $in: ["Category", "SubCategory", "GrandCategory"] },
      })
        .sort({ timestamp: -1 })
        .populate({
          path: "performedBy",
          select: "name isAdmin isVendor isUser isHr isMarketing isStaff",
        });

      const enhancedActivities = activities.map((activity) => {
        const { performedBy } = activity;
        let role = "Unknown";
        if (performedBy?.isAdmin) role = "Admin";
        else if (performedBy?.isVendor) role = "Vendor";
        else if (performedBy?.isUser) role = "User";
        else if (performedBy?.isHr) role = "HR";
        else if (performedBy?.isMarketing) role = "Marketing";
        else if (performedBy?.isStaff) role = "Staff";

        return {
          ...activity._doc,
          performedBy: {
            name: performedBy?.name || "Unknown",
            role,
          },
        };
      });

      const categoriesWithActivities = categories.map((category) => {
        const categoryActivity = enhancedActivities.find(
          (activity) =>
            activity.modelAffected === "Category" &&
            activity.performedAt.toString() === category._id.toString()
        );

        const subCategoriesWithActivities = category.subCategories.map(
          (subCategory) => {
            const subCategoryActivity = enhancedActivities.find(
              (activity) =>
                activity.modelAffected === "SubCategory" &&
                activity.performedAt.toString() === subCategory._id.toString()
            );

            const grandCategoriesWithActivities =
              subCategory.grandCategories.map((grandCategory) => {
                const grandCategoryActivity = enhancedActivities.find(
                  (activity) =>
                    activity.modelAffected === "GrandCategory" &&
                    activity.performedAt.toString() ===
                      grandCategory._id.toString()
                );

                return {
                  ...grandCategory.toObject(),
                  activity: grandCategoryActivity || null,
                };
              });

            return {
              ...subCategory.toObject(),
              activity: subCategoryActivity || null,
              grandCategories: grandCategoriesWithActivities,
            };
          }
        );

        return {
          ...category.toObject(),
          activity: categoryActivity || null,
          subCategories: subCategoriesWithActivities,
        };
      });

      return categoriesWithActivities;
    } catch (error) {
      throw new Error(
        "Error getting categories with activities: " + error.message
      );
    }
  }
}

module.exports = new CategoryService();
