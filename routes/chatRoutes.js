const express = require("express");
const router = express.Router();
const messageController = require("../controller/chatController");

router.post("/send", messageController.sendMessage);

router.get("/chat/:userId/:chatId", messageController.getMessages);

router.get("/history/:userId", messageController.getChatHistory);

module.exports = router;
