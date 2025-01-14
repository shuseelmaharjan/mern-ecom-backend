const express = require("express");
const { upload, processImage } = require("../middleware/imageProcessor");
const categoryController = require("../controller/categoryController");

const router = express.Router();

router.post(
  "/v1/create-category",
  upload.single("image"),
  processImage,
  categoryController.createCategory
);

router.put(
  "/category/:id",
  upload.single("image"),
  processImage,
  categoryController.updateCategory
);

router.delete("/category/:id", categoryController.deleteCategory);

router.post(
  "/v1/subcategory/:categoryId",
  upload.single("image"),
  processImage,
  categoryController.createSubCategory
);

router.post(
  "/v1/grandcategory/:categoryId/:subCategoryId",
  upload.single("image"),
  processImage,
  categoryController.createGrandCategory
);

router.get("/v1/categories/active", categoryController.getAllCategory);
router.get("/v1/categories/all", categoryController.getCategory);

module.exports = router;
