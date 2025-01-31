const { SiteManager, SiteLogModel, Charge } = require("../models/site");
const User = require("../models/users");

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

  async createSiteManagerData(body, userId, logoFilename) {
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

      const { title, tagline, description } = body;
      const newSiteData = new SiteManager({
        title,
        tagline,
        logo: logoFilename,
        description,
      });

      await newSiteData.save();

      await SiteLogModel.create({
        action: "added",
        field: "title",
        newValue: title,
        user: userId,
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

  async updateSiteManagerData(id, body, userId, logoFilename) {
    try {
      const siteManager = await SiteManager.findById(id);

      if (!siteManager) {
        return {
          status: 404,
          data: { message: "SiteManager document not found" },
        };
      }

      const updateData = {};
      const logs = [];

      const { title, tagline, description } = body;

      if (title && title !== siteManager.title) {
        updateData.title = title;
        logs.push({
          action: "updated",
          field: "title",
          previousValue: siteManager.title,
          newValue: title,
          user: userId,
        });
      }

      if (tagline && tagline !== siteManager.tagline) {
        updateData.tagline = tagline;
        logs.push({
          action: "updated",
          field: "tagline",
          previousValue: siteManager.tagline,
          newValue: tagline,
          user: userId,
        });
      }

      if (description && description !== siteManager.description) {
        updateData.description = description;
        // logs.push({
        //   action: "updated",
        //   field: "description",
        //   previousValue: siteManager.description,
        //   newValue: description,
        //   user: userId,
        // });
      }

      if (logoFilename && logoFilename !== siteManager.logo) {
        updateData.logo = logoFilename;
        // logs.push({
        //   action: "updated",
        //   field: "logo",
        //   previousValue: siteManager.logo,
        //   newValue: logoFilename,
        //   user: userId,
        // });
      }

      if (Object.keys(updateData).length === 0) {
        return {
          status: 400,
          data: { message: "No changes detected to update" },
        };
      }

      updateData.lastUpdated = new Date();

      await SiteManager.findByIdAndUpdate(id, updateData);

      if (logs.length > 0) {
        await SiteLogModel.insertMany(logs);
      }

      return {
        status: 200,
        data: { message: "SiteManager data updated successfully" },
      };
    } catch (error) {
      console.error("Error in updateSiteManagerData:", error.message);
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

  async createCharge(body) {
    try {
      const { title, percentage } = body;

      const newCharge = new Charge({
        title,
        percentage,
        isActive: true,
      });

      await newCharge.save();

      return {
        status: 201,
        data: { message: "Charge created successfully" },
      };
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  async getSiteCharges() {
    try {
      const charges = await Charge.find({ isActive: true });
      return {
        status: 200,
        data: charges,
      };
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }
}

module.exports = new SiteService();
