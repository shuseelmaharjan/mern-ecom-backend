const express = require("express");
const router = express.Router();
const CategoryController = require("../controller/categoryController");
const { verifyRoles } = require("../middleware/authJWT");

// CRUD for Categories
router.post(
  "/v1/create-category",
  verifyRoles("vendor", "admin"),
  CategoryController.createCategory
);
router.delete(
  "/v1/delete-category/:id",
  verifyRoles("vendor", "admin"),
  CategoryController.deleteCategory
);
router.put(
  "/v1/update-category/:id",
  verifyRoles("vendor", "admin"),
  CategoryController.updateCategory
);
router.get("/v1/list-categories", CategoryController.listCategory);

// CRUD for SubCategories
router.post(
  "/v1/create-subcategory/:categoryId",
  verifyRoles("vendor", "admin"),
  CategoryController.createSubCategory
);
router.put(
  "/v1/update-subcategory/:categoryId/:subCategoryId",
  verifyRoles("vendor", "admin"),
  CategoryController.updateSubCategory
);
router.delete(
  "/v1/delete-subcategory/:categoryId/:subCategoryId",
  verifyRoles("vendor", "admin"),
  CategoryController.deleteSubCategory
);
router.get(
  "/v1/list-subcategories/:categoryId",
  CategoryController.listSubCategories
);

// CRUD for GrandCategories
router.post(
  "/v1/create-grandcategory/:categoryId/:subCategoryId",
  verifyRoles("vendor", "admin"),
  CategoryController.createGrandCategory
);
router.put(
  "/v1/update-grandcategory/:categoryId/:subCategoryId/:grandCategoryId",
  verifyRoles("vendor", "admin"),
  CategoryController.updateGrandCategory
);
router.delete(
  "/v1/delete-grandcategory/:categoryId/:subCategoryId/:grandCategoryId",
  verifyRoles("vendor", "admin"),
  CategoryController.deleteGrandCategory
);
router.get(
  "/v1/list-grandcategories/:categoryId/:subCategoryId",
  CategoryController.listGrandCategories
);

module.exports = router;
