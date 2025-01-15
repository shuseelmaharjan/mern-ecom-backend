const cron = require("node-cron");
const { Campaign } = require("../models/campaign");

cron.schedule("* * * * *", async () => {
  try {
    const campaigns = await Campaign.find();

    const currentTime = new Date();

    for (let campaign of campaigns) {
      const isActive =
        currentTime >= new Date(campaign.startTime) &&
        currentTime <= new Date(campaign.expiryTime);

      if (campaign.isActive !== isActive) {
        campaign.isActive = isActive;
        await campaign.save();

        console.log(
          `Campaign "${campaign.title}" is now ${
            isActive ? "active" : "inactive"
          }`
        );
      }
    }
  } catch (error) {
    console.error("Error updating campaign statuses:", error.message);
  }
});
