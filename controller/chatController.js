const messageService = require("../services/chatService");

const sendMessage = async (req, res) => {
  const { senderId, receiverId, message } = req.body;

  try {
    const sentMessage = await messageService.sendMessage(
      senderId,
      receiverId,
      message
    );
    res.status(201).json({
      success: true,
      message: sentMessage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get messages between two users
const getMessages = async (req, res) => {
  const { userId, chatId } = req.params;

  try {
    const messages = await messageService.getMessages(userId, chatId);
    res.status(200).json({
      success: true,
      messages: messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getChatHistory = async (req, res) => {
  const { userId } = req.params;

  try {
    const chatHistory = await messageService.getChatHistory(userId);
    res.status(200).json({
      success: true,
      chatHistory: chatHistory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  getChatHistory,
};
