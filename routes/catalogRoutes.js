const express = require('express');
const CatalogController = require('../controller/catalogController');
const verifyJWT = require('../middleware/staffadminAuth'); 
const router = express.Router();

router.route('/v1/get-all-catalogs').get(verifyJWT, CatalogController.getAllCatalogs);

router.route('/v1/get-user-catalogs').get(verifyJWT, CatalogController.getUserCatalogs);

module.exports = router;
