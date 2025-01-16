const express = require("express");
const { upload, processImage } = require("../middleware/imageProcessor");
const categoryController = require("../controller/categoryController");
const { verifyMarketing } = require("../middleware/authJWT");

const router = express.Router();

router.post(
  "/v1/create-category",
  upload.single("image"),
  processImage,
  verifyMarketing,
  categoryController.createCategory
);

router.post(
  "/v1/subcategory/:categoryId",
  upload.single("image"),
  processImage,
  verifyMarketing,
  categoryController.createSubCategory
);

router.post(
  "/v1/grandcategory/:categoryId/:subCategoryId",
  upload.single("image"),
  processImage,
  verifyMarketing,
  categoryController.createGrandCategory
);

router.get("/v1/categories/active", categoryController.getAllCategory);
router.get("/v1/categories/all", categoryController.getCategory);
//remove categories
router.put("/v1/remove-category/:id", categoryController.updateRemoveCategory);
router.put(
  "/v1/remove-subcategory/:parentId/:subId",
  verifyMarketing,
  categoryController.updateRemoveSubCategory
);
router.put(
  "/v1/remove-grandcategory/:parentId/:subId/:grandId",
  verifyMarketing,
  categoryController.updateRemoveGrandCategory
);

//update category details
router.put(
  "/v1/update/category/:id",
  upload.single("image"),
  processImage,
  verifyMarketing,
  categoryController.updateCategory
);

router.put(
  "/v1/update/subcategory/:catId/:id",
  upload.single("image"),
  processImage,
  verifyMarketing,
  categoryController.updateSubCategory
);

router.put(
  "/v1/update-grandcategory/:catId/:subId/:id",
  upload.single("image"),
  processImage,
  verifyMarketing,
  categoryController.updateGrandCategory
);

router.get("/cat-suggestions", (req, res) =>
  categoryController.suggestCategories(req, res)
);

module.exports = router;
