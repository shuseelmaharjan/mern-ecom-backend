const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const productController = require("../controller/productController");
const { verifyVendor } = require("./../middleware/authJWT");

const createDirIfNotExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = file.mimetype.startsWith("image/")
      ? "uploads/products"
      : "uploads/product-media";

    const fullPath = path.join(__dirname, `../${uploadDir}`);
    createDirIfNotExists(fullPath);

    cb(null, fullPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post(
  "/v1/add-product",
  verifyVendor,
  upload.array("files"),
  (req, res) => productController.create(req, res)
);
router.put("/v1/update-product/:id", verifyVendor, (req, res) =>
  productController.update(req, res)
);
router.delete("/v1/delete-product/:id", verifyVendor, (req, res) =>
  productController.delete(req, res)
);
router.get("/v1/list-products", verifyVendor, (req, res) =>
  productController.list(req, res)
);

module.exports = router;
