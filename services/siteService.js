const { SiteManager, SiteLogModel } = require("../models/site");
const User = require("../models/users");
const path = require("path");

class SiteService {
  constructor(user) {
    this.user = user;
  }

  async createLogEntry(action, field, previousValue, newValue) {
    const logEntry = new SiteLogModel({
      action,
      field,
      previousValue,
      newValue,
      user: this.user._id,
      createdAt: new Date(),
    });

    await logEntry.save();
  }

  async createSiteManagerData(req, id) {
    try {
      const existingData = await SiteManager.findOne();
      if (existingData) {
        return {
          status: 400,
          data: {
            message: "Only one document allowed in the SiteManager collection",
          },
        };
      }

      const { title, tagline, logo, description } = req.body;
      const newSiteData = new SiteManager({
        title,
        tagline,
        logo,
        description,
      });

      await newSiteData.save();

      await SiteLogModel.create({
        action: "added",
        field: "title",
        newValue: title,
        user: id,
      });

      return {
        status: 201,
        data: { message: "SiteManager data created successfully" },
      };
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  async getSiteManagerData() {
    try {
      const siteData = await SiteManager.findOne();

      if (!siteData) {
        return {
          status: 404,
          data: { message: "SiteManager data not found" },
        };
      }

      const today = new Date();
      const last30Days = new Date(today.setDate(today.getDate() - 30));

      const logs = await SiteLogModel.find({ createdAt: { $gte: last30Days } })
        .sort({ createdAt: -1 })
        .populate("user", "email name");

      const logSentences = logs.map((log) => {
        const user = log.user ? log.user.name : "Unknown user";
        const previous = log.previousValue || "No previous value";
        const newValue = log.newValue || "No new value";

        const logDate = new Date(log.createdAt);
        const today = new Date();

        const isToday = logDate.toDateString() === today.toDateString();

        const formattedDate = isToday
          ? `Today at ${logDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}`
          : logDate.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            });

        return `${user} ${log.action} the field '${log.field}' from '${previous}' to '${newValue}' on ${formattedDate}.`;
      });

      const admins = await User.find({ isAdmin: true }).select(
        "name email phoneNumber profileImg createdAt lastUpdate"
      );

      return {
        status: 200,
        data: {
          siteData,
          logs: logSentences,
          admins,
        },
      };
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }
}

module.exports = new SiteService();
