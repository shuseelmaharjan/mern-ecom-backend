const express = require("express");
const router = express.Router();
const userController = require("../controller/usersController");

router.post("/v1/create-hr", userController.addUser);

module.exports = router;
