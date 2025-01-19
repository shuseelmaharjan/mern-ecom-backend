const express = require("express");
const router = express.Router();
const userController = require("../controller/usersController");
const { verifyAdmin, verifyAccessToken } = require("../middleware/authJWT");
const uploadProfile = require("../middleware/uploadProfile");

router.post("/v1/hr", verifyAdmin, userController.addHr);
router.get("/v1/hr", verifyAdmin, userController.getHrData);
router.post(
  "/v1/create-employee",
  verifyAccessToken,
  userController.createEmployee
);
router.patch(
  "/v1/update-user/:userId",
  verifyAccessToken,
  userController.updateUser
);
router.get("/v1/users/:id", verifyAccessToken, userController.getUserDetails);
router.get(
  "/v1/setting-profile/:userId",
  verifyAccessToken,
  userController.settingUserInfo
);
router.post(
  "/v1/upload-profile-image/:userId",
  verifyAccessToken,
  uploadProfile.uploadProfile.single("profileImg"),
  uploadProfile.resizeAndSaveImage,
  userController.uploadUserImage
);
router.put(
  "/v1/update-name/:userId",
  verifyAccessToken,
  userController.updateUserNmae
);

router.put(
  "/v1/update-email/:userId",
  verifyAccessToken,
  userController.updateUserEmail
);

router.put(
  "/v1/change-password",
  verifyAccessToken,
  userController.changePassword
);

router.post(
  "/v1/marketing-manager",
  verifyAccessToken,
  userController.addMarketing
);
router.get(
  "/v1/marketing-manager",
  verifyAccessToken,
  userController.getMarketingManagerData
);
router.post("/v1/staff", verifyAccessToken, userController.addStaff);
router.get("/v1/staff", verifyAccessToken, userController.getStaffs);

router.get(
  "/v1/get-my-default-address",
  verifyAccessToken,
  userController.getDefaultShippingAddress
);

module.exports = router;
