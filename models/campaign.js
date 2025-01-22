const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema({
  saleType: {
    type: String,
    enum: ["SALE", "BRAND", "FESTIVAL", "FREESHIPPING"],
    required: false,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  expiryTime: {
    type: Date,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  banner: {
    type: String,
    required: false,
  },
  poster: {
    type: String,
    required: false,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  discountPercentage: {
    type: Number,
    default: null,
  },
  priority: {
    type: String,
    enum: ["HEADER", "BANNER", "DEAL", "HOME"],
    required: true,
  },
  totalVisits: {
    type: Number,
    default: 0,
  },
  totalSales: {
    type: Number,
    default: 0,
  },
  totalRevenue: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const campaignLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
  },
  affectedObjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campaign",
    required: true,
  },
  performedBy: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Campaign = mongoose.model("Campaign", campaignSchema);
const CampaignLog = mongoose.model("CampaignLog", campaignLogSchema);

module.exports = { Campaign, CampaignLog };
