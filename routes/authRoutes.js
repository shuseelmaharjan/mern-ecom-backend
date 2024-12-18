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

router.route('/v1/logout')
    .post(authController.logout)


module.exports = router;
