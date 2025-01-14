const categoryService = require("../services/categoryService");
const RoleChecker = require("../helper/roleChecker");
const GetUserId = require("../helper/getUserId");

class CategoryController {
  async createCategory(req, res) {
    try {
      const roleChecker = new RoleChecker(req);
      const role = await roleChecker.getRole();
      const userId = new GetUserId(req);
      const id = await userId.getUserId();

      if (role !== "mm") {
        return res.status(401).json({ message: "Unauthorized" });
      }
      await categoryService.createCategory(req.body, id);
      res.status(201).json({
        message: "Category created successfully.",
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateCategory(req, res) {
    try {
      const roleChecker = new RoleChecker(req);
      const role = await roleChecker.getRole();
      const userId = new GetUserId(req);
      const id = await userId.getUserId();

      if (role !== "mm") {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const category = await categoryService.updateCategory(
        req.params.id,
        req.body,
        id
      );

      res.status(200).json({
        message: "Category updated successfully.",
        data: category,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteCategory(req, res) {
    try {
      const roleChecker = new RoleChecker(req);
      const role = await roleChecker.getRole();
      const userId = new GetUserId(req);
      const id = await userId.getUserId();

      if (role !== "mm") {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const category = await categoryService.deleteCategory(req.params.id, id);

      res.status(200).json({
        message: "Category deleted successfully.",
        data: category,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async createSubCategory(req, res) {
    try {
      const { categoryId } = req.params;
      const subCategoryData = req.body;

      const roleChecker = new RoleChecker(req);
      const userIdHelper = new GetUserId(req);

      const role = await roleChecker.getRole();
      const userId = await userIdHelper.getUserId();

      if (role !== "mm") {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const category = await categoryService.addSubCategory(
        categoryId,
        subCategoryData,
        userId
      );

      res.status(201).json({
        message: "Subcategory created successfully",
        category,
      });
    } catch (error) {
      console.error("Error creating subcategory:", error.message);
      res.status(500).json({ message: error.message });
    }
  }

  async createGrandCategory(req, res) {
    try {
      const { categoryId, subCategoryId } = req.params;
      const grandCategoryData = req.body;

      const roleChecker = new RoleChecker(req);
      const userIdHelper = new GetUserId(req);

      const role = await roleChecker.getRole();
      const userId = await userIdHelper.getUserId();

      if (role !== "mm") {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const category = await categoryService.addGrandCategory(
        categoryId,
        subCategoryId,
        grandCategoryData,
        userId
      );

      res.status(201).json({
        message: "Grandcategory created successfully",
        category,
      });
    } catch (error) {
      console.error("Error creating grandcategory:", error.message);
      res.status(500).json({ message: error.message });
    }
  }

  async getAllCategory(req, res) {
    try {
      const activeCategories = await categoryService.getAllCategory();
      if (!activeCategories || activeCategories.length === 0) {
        return res.status(404).json({ message: "No active categories found." });
      }

      return res.status(200).json(activeCategories);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Server error, please try again." });
    }
  }

  async getCategory(req, res) {
    try {
      const activeCategories = await categoryService.getCategory();
      if (!activeCategories || activeCategories.length === 0) {
        return res.status(404).json({ message: "No active categories found." });
      }

      return res.status(200).json(activeCategories);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Server error, please try again." });
    }
  }
}

module.exports = new CategoryController();
