const mongoose = require("mongoose");

const siteManager = new mongoose.Schema(
  {
    title: { type: String, required: true },
    narration: { type: String, required: true },
    logo: { type: String, default: null },
    primaryColor: { type: String, required: true },
    secondaryColor: { type: String, required: true },
    buttonColor: { type: String, required: true },
    hoverButtonColor: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

siteManager.statics.ensureSingleDocument = async function () {
  const count = await this.countDocuments();
  if (count > 0) {
    throw new Error("Only one document is allowed in the SiteManager collection.");
  }
};

const SiteManager =
  mongoose.models.SiteManager || mongoose.model("Site", siteManager);

module.exports = SiteManager;
