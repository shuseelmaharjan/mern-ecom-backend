const { Category, Catalog } = require('../models/categories');
const User = require('../models/User');
const { toLowerSentenceCase } = require('../utils/textUtils');

class CategoryController {


  // @desc Default Constructor to record the activity log
  static async recordCatalog(action, model, userId, details = '') {
    await Catalog.create({
      action,
      modelAffected: model,
      performedBy: userId,
      details,
    });
  }

  // @desc helper to find the name
  static validateName(name) {
    return /^[a-zA-Z\s]+$/.test(name); 
  }

  // @desc Create Category
  // @route POST /api/v1/create-category
  // @access Private - Only accessable by staff and admin
  static async createCategory(req, res) {
    try {
      let { name } = req.body;
      const { id: userId } = req.user;

      // category name validator
      if (!CategoryController.validateName(name)) {
        return res.status(400).json({ message: 'Category name must contain only letters and spaces.' });
      }

      name = toLowerSentenceCase(name);

      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        return res.status(409).json({ message: `Category "${name}" already exists.` });
      }

      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });

      const newCategory = await Category.create({ name });

      await CategoryController.recordCatalog('CREATE', 'Category', userId, `Category "${name}" created by "${user.name}".`);

      return res.status(201).json(newCategory);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // @desc Delete Category
  // @route Delete /api/v1/delete-category/:id
  // @access Private - Only accessable by staff and admin
  static async deleteCategory(req, res) {
    try {
      const { id: categoryId } = req.params;
      const { id: userId } = req.user;

      if (!categoryId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ message: 'Invalid category ID format.' });
      }

      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({ message: 'Category not found.' });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      await category.deleteOne();

      await CategoryController.recordCatalog(
        'DELETE',
        'Category',
        userId,
        `Category "${category.name}" deleted by "${user.name}".`
      );

      return res.status(200).json({ message: `Category "${category.name}" deleted successfully.` });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // @desc Update Category
  // @route PUT /api/v1/update-category/:id
  // @access Private - Only accessable by staff and admin
  static async updateCategory(req, res) {
    try {
      const { id: categoryId } = req.params;
      let { name } = req.body;
      const { id: userId } = req.user;

      if (!categoryId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ message: 'Invalid category ID format.' });
      }

      if (!CategoryController.validateName(name)) {
        return res.status(400).json({ message: 'Category name must contain only letters and spaces.' });
      }

      name = toLowerSentenceCase(name);

      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({ message: 'Category not found.' });
      }

      category.name = name;
      await category.save();

      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });

      await CategoryController.recordCatalog(
        'UPDATE',
        'Category',
        userId,
        `Category updated to "${name}" by "${user.name}".`
      );

      return res.status(200).json({ message: `Category updated to "${name}" successfully.` });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // @desc List Category
  // @route GET /api/v1/list-categories
  // @access Public - Only accessable by staff and admin
  static async listCategory(req, res) {
    try {
      const categories = await Category.find({});
      return res.status(200).json(categories);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }



  // @desc Create SubCategory
  // @route POST /api/v1/create-subcategory/:categoryId
  // @access Public - Only accessable by staff and admin
  static async createSubCategory(req, res) {
    try {
      const { categoryId } = req.params;
      const { name } = req.body;
      const { id: userId } = req.user;

      if (!CategoryController.validateName(name)) {
        return res.status(400).json({ message: 'Invalid name format. Only lowercase letters and spaces are allowed.' });
      }

      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({ message: 'Category not found.' });
      }

      if (category.subCategories.some((sub) => sub.name === name.toLowerCase())) {
        return res.status(409).json({ message: `Subcategory "${name}" already exists.` });
      }

      category.subCategories.push({ name: name.toLowerCase() });
      await category.save();

      await CategoryController.recordCatalog('CREATE', 'SubCategory', userId, `SubCategory "${name}" added to Category "${category.name}".`);
      return res.status(201).json({ message: `SubCategory "${name}" added successfully.` });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // @desc Update SubCategory
  // @route PUT /api/v1/update-subcategory/:categoryId/:subCategoryId
  // @access Public - Only accessible by staff and admin
  static async updateSubCategory(req, res) {
    try {
      const { categoryId, subCategoryId } = req.params;
      const { name } = req.body;
      const { id: userId } = req.user;

      if (!CategoryController.validateName(name)) {
        return res.status(400).json({ message: 'Invalid name format. Only lowercase letters and spaces are allowed.' });
      }

      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({ message: 'Category not found.' });
      }

      const subCategory = category.subCategories.id(subCategoryId);
      if (!subCategory) {
        return res.status(404).json({ message: 'SubCategory not found.' });
      }

      // Check for unique subcategory name within the same category
      if (category.subCategories.some((sub) => sub.name === name.toLowerCase() && sub.id !== subCategoryId)) {
        return res.status(409).json({ message: `SubCategory "${name}" already exists.` });
      }

      subCategory.name = name.toLowerCase();
      await category.save();

      await CategoryController.recordCatalog(
        'UPDATE',
        'SubCategory',
        userId,
        `SubCategory "${subCategory.name}" updated to "${name}" in Category "${category.name}".`
      );

      return res.status(200).json({ message: `SubCategory updated to "${name}" successfully.` });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  
  // @desc Delete SubCategory
  // @route DELETE /api/v1/delete-subcategory/:categoryId/:subCategoryId
  // @access Public - Only accessible by staff and admin
  static async deleteSubCategory(req, res) {
    try {
      const { categoryId, subCategoryId } = req.params;
      const { id: userId } = req.user;

      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({ message: 'Category not found.' });
      }

      const subCategory = category.subCategories.id(subCategoryId);
      if (!subCategory) {
        return res.status(404).json({ message: 'SubCategory not found.' });
      }

      // Remove the subcategory using pull
      category.subCategories.pull({ _id: subCategoryId });
      await category.save();

      await CategoryController.recordCatalog(
        'DELETE',
        'SubCategory',
        userId,
        `SubCategory "${subCategory.name}" deleted from Category "${category.name}".`
      );

      return res.status(200).json({ message: `SubCategory "${subCategory.name}" deleted successfully.` });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }


  // @desc Get all SubCategories of a Category
  // @route GET /api/v1/list-subcategories/:categoryId
  // @access Public - Only accessible by staff and admin
  static async listSubCategories(req, res) {
    try {
      const { categoryId } = req.params;

      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({ message: 'Category not found.' });
      }

      return res.status(200).json({
        message: `SubCategories of Category "${category.name}" fetched successfully.`,
        subCategories: category.subCategories,
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // @desc Create Grand Category
  // @route POST /api/v1/create-grandcategory/:categoryId/:subCategoryId
  // @access Public - Only accessable by staff and admin
  static async createGrandCategory(req, res) {
    try {
      const { categoryId, subCategoryId } = req.params;
      const { name } = req.body;
      const { id: userId } = req.user;

      if (!CategoryController.validateName(name)) {
        return res.status(400).json({ message: 'Invalid name format. Only lowercase letters and spaces are allowed.' });
      }

      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({ message: 'Category not found.' });
      }

      const subCategory = category.subCategories.id(subCategoryId);
      if (!subCategory) {
        return res.status(404).json({ message: 'SubCategory not found.' });
      }

      if (subCategory.grandCategories.some((grand) => grand.name === name.toLowerCase())) {
        return res.status(409).json({ message: `GrandCategory "${name}" already exists.` });
      }

      subCategory.grandCategories.push({ name: name.toLowerCase() });
      await category.save();

      await CategoryController.recordCatalog(
        'CREATE',
        'GrandCategory',
        userId,
        `GrandCategory "${name}" added to SubCategory "${subCategory.name}".`
      );
      return res.status(201).json({ message: `GrandCategory "${name}" added successfully.` });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // @desc Update GrandCategory
  // @route PUT /api/v1/update-grandcategory/:categoryId/:subCategoryId/:grandCategoryId
  // @access Public - Only accessible by staff and admin
  static async updateGrandCategory(req, res) {
    try {
      const { categoryId, subCategoryId, grandCategoryId } = req.params;
      const { name } = req.body;
      const { id: userId } = req.user;

      if (!CategoryController.validateName(name)) {
        return res.status(400).json({ message: 'Invalid name format. Only lowercase letters and spaces are allowed.' });
      }

      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({ message: 'Category not found.' });
      }

      const subCategory = category.subCategories.id(subCategoryId);
      if (!subCategory) {
        return res.status(404).json({ message: 'SubCategory not found.' });
      }

      const grandCategory = subCategory.grandCategories.id(grandCategoryId);
      if (!grandCategory) {
        return res.status(404).json({ message: 'GrandCategory not found.' });
      }

      // Ensure the new name is unique within the same subcategory
      if (subCategory.grandCategories.some((grand) => grand.name === name.toLowerCase() && grand.id !== grandCategoryId)) {
        return res.status(409).json({ message: `GrandCategory "${name}" already exists.` });
      }

      grandCategory.name = name.toLowerCase();
      await category.save();

      await CategoryController.recordCatalog(
        'UPDATE',
        'GrandCategory',
        userId,
        `GrandCategory "${grandCategory.name}" updated to "${name}" in SubCategory "${subCategory.name}".`
      );

      return res.status(200).json({ message: `GrandCategory updated to "${name}" successfully.` });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // @desc Delete GrandCategory
  // @route DELETE /api/v1/delete-grandcategory/:categoryId/:subCategoryId/:grandCategoryId
  // @access Public - Only accessible by staff and admin
  static async deleteGrandCategory(req, res) {
    try {
      const { categoryId, subCategoryId, grandCategoryId } = req.params;
      const { id: userId } = req.user;

      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({ message: 'Category not found.' });
      }

      const subCategory = category.subCategories.id(subCategoryId);
      if (!subCategory) {
        return res.status(404).json({ message: 'SubCategory not found.' });
      }

      const grandCategory = subCategory.grandCategories.id(grandCategoryId);
      if (!grandCategory) {
        return res.status(404).json({ message: 'GrandCategory not found.' });
      }

      // Remove the grand category using pull
      subCategory.grandCategories.pull({ _id: grandCategoryId });
      await category.save();

      await CategoryController.recordCatalog(
        'DELETE',
        'GrandCategory',
        userId,
        `GrandCategory "${grandCategory.name}" deleted from SubCategory "${subCategory.name}".`
      );

      return res.status(200).json({ message: `GrandCategory "${grandCategory.name}" deleted successfully.` });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
  

  // @desc Get all GrandCategories of a SubCategory
  // @route GET /api/v1/list-grandcategories/:categoryId/:subCategoryId
  // @access Public - Only accessible by staff and admin
  static async listGrandCategories(req, res) {
    try {
      const { categoryId, subCategoryId } = req.params;

      // Find the category by its ID
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({ message: 'Category not found.' });
      }

      // Find the subcategory within the category
      const subCategory = category.subCategories.id(subCategoryId);
      if (!subCategory) {
        return res.status(404).json({ message: 'SubCategory not found.' });
      }

      // Return the grand categories list
      return res.status(200).json({
        message: `GrandCategories of SubCategory "${subCategory.name}" in Category "${category.name}" fetched successfully.`,
        grandCategories: subCategory.grandCategories,
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

}

module.exports = CategoryController;
