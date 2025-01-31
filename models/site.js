const mongoose = require("mongoose");

const siteManagerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    tagline: { type: String, required: true },
    description: { type: String, required: true },
    logo: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
    lastUpdated: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

siteManagerSchema.statics.ensureSingleDocument = async function () {
  const count = await this.countDocuments();
  if (count > 0) {
    throw new Error(
      "Only one document is allowed in the SiteManager collection."
    );
  }
};

const logSchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    field: { type: String, required: true },
    previousValue: { type: String, default: null },
    newValue: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

const chargeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  percentage: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

const SiteLogModel =
  mongoose.models.SiteLogModel || mongoose.model("SiteLogModel", logSchema);

const Charge = mongoose.model("Charge", chargeSchema);

const SiteManager =
  mongoose.models.SiteManager ||
  mongoose.model("SiteManager", siteManagerSchema);

module.exports = { SiteManager, SiteLogModel, Charge };
