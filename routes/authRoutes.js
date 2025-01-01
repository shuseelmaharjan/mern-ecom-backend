const express = require("express");
const router = express.Router();
const authController = require("../controller/authControler");
const loginLimiter = require("../middleware/loginLimiter");
const { verifyAccessToken, verifyUser } = require("../middleware/authJWT");

router.route("/v1/signup").post(loginLimiter, authController.signup);

router.route("/v1/login").post(loginLimiter, authController.login);

router.route("/v1/refresh").get(authController.refresh);

router.route("/v2/refresh").get(authController.refreshT);

router.route("/v1/logout").post(authController.logout);

router.route("/v1/check-token").get(authController.checkTokenValidity);

router
  .route("/v1/update-profile")
  .put(verifyAccessToken, authController.updateUserDetails);

router
  .route("/v1/upgrade-to-vendor")
  .put(
    verifyAccessToken,
    verifyUser,
    authController.updateUserRoleFromUserToVendor
  );

router.route("/v1/user-info").get(verifyAccessToken, authController.userInfo);

module.exports = router;
