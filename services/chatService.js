const Message = require("../models/messages");
const User = require("../models/users");

// Send a message
const sendMessage = async (senderId, receiverId, messageContent) => {
  try {
    const message = new Message({
      sender: senderId,
      receiver: receiverId,
      message: messageContent,
    });

    await message.save();
    return message;
  } catch (error) {
    throw new Error("Error sending message: " + error.message);
  }
};

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const getMessages = async (userId, chatId) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: new ObjectId(userId), receiver: new ObjectId(chatId) },
        { sender: new ObjectId(chatId), receiver: new ObjectId(userId) },
      ],
    }).sort({ timestamp: 1 });

    return messages;
  } catch (error) {
    throw new Error("Error fetching messages: " + error.message);
  }
};

// Get chat history
const getChatHistory = async (userId) => {
  try {
    const chatHistory = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: new ObjectId(userId) },
            { receiver: new ObjectId(userId) },
          ],
        },
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$sender", new ObjectId(userId)] },
              then: "$receiver",
              else: "$sender",
            },
          },
          lastMessage: { $last: "$message" },
          lastTimestamp: { $last: "$timestamp" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "chatUser",
        },
      },
      {
        $unwind: "$chatUser",
      },
      {
        $project: {
          userId: "$_id",
          lastMessage: 1,
          lastTimestamp: 1,
          chatUserName: "$chatUser.name",
          chatUserProfile: "$chatUser.profileImage",
        },
      },
    ]);
    return chatHistory;
  } catch (error) {
    throw new Error("Error fetching chat history: " + error.message);
  }
};

module.exports = {
  sendMessage,
  getMessages,
  getChatHistory,
};
