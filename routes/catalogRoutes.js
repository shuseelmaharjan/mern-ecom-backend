const express = require("express");
const CatalogController = require("../controller/catalogController");
const { verifyVendor } = require("../middleware/authJWT");
const router = express.Router();

router
  .route("/v1/get-all-catalogs")
  .get(verifyVendor, CatalogController.getAllCatalogs);

router
  .route("/v1/get-user-catalogs")
  .get(verifyVendor, CatalogController.getUserCatalogs);

module.exports = router;
