const express = require('express');
const { userLogin, refreshToken } = require('../controllers/userLogin');

const router = express.Router();

router.post("/v1/login", userLogin);
router.post("/v1/refresh-token", refreshToken);

module.exports = router; 
