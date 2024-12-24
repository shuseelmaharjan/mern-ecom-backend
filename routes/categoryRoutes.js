const express = require('express');
const router = express.Router();
const CategoryController = require('../controller/categoryController');
const authMiddleware = require('../middleware/staffadminAuth');

// CRUD for Categories
router.post('/v1/create-category', authMiddleware, CategoryController.createCategory);
router.delete('/v1/delete-category/:id', authMiddleware, CategoryController.deleteCategory);
router.put('/v1/update-category/:id', authMiddleware, CategoryController.updateCategory);
router.get('/v1/list-categories', CategoryController.listCategory);

// CRUD for SubCategories
router.post('/v1/create-subcategory/:categoryId', authMiddleware, CategoryController.createSubCategory);
router.put('/v1/update-subcategory/:categoryId/:subCategoryId', authMiddleware, CategoryController.updateSubCategory);
router.delete('/v1/delete-subcategory/:categoryId/:subCategoryId', authMiddleware, CategoryController.deleteSubCategory);


// CRUD for GrandCategories
router.post('/v1/create-grandcategory/:categoryId/:subCategoryId', authMiddleware, CategoryController.createGrandCategory);
router.put('/v1/update-grandcategory/:categoryId/:subCategoryId/:grandCategoryId',authMiddleware,CategoryController.updateGrandCategory);
router.delete('/v1/delete-grandcategory/:categoryId/:subCategoryId/:grandCategoryId',authMiddleware,CategoryController.deleteGrandCategory);
  
module.exports = router;
