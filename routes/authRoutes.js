const express = require('express');
const router = express.Router();
const authController = require('../controller/authControler');
const loginLimiter = require('../middleware/loginLimiter')

router.route('/v1/signup')
    .post(loginLimiter, authController.signup)

router.route('/v1/login')
    .post(loginLimiter, authController.login)

router.route('/v1/refresh')
    .get(authController.refresh)

router.route('/v2/refresh')
    .get(authController.refreshToken)

router.route('/v1/logout')
    .post(authController.logout)

router.route('/v1/check-token')
    .get(authController.checkTokenValidity);



module.exports = router;
