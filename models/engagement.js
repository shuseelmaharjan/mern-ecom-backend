const mongoose = require("mongoose");

const engagementSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campaign",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiryTime: {
    type: Date,
    required: true,
  },
});

const Engagement = mongoose.model("Engagement", engagementSchema);

module.exports = Engagement;
