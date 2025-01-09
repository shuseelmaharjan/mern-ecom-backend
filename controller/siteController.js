const siteService = require("../services/siteService");
const RoleChecker = require("../helper/roleChecker");
const GetUserId = require("../helper/getUserId");

class SiteController {
  async createSiteManagerData(req, res) {
    try {
      const roleChecker = new RoleChecker(req);
      const role = await roleChecker.getRole();
      const userId = new GetUserId(req);
      const id = await userId.getUserId();

      if (role !== "admin") {
        return res.status(500).json({ message: "Unauthorized" });
      }
      const logoFilename = req.file ? `/uploads/${req.file.filename}` : null;
      const response = await siteService.createSiteManagerData(
        req.body,
        id,
        logoFilename
      );

      res.status(response.status).json(response.data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }

  async getSiteManagerData(req, res) {
    try {
      const response = await siteService.getSiteManagerData();

      res.status(response.status).json(response.data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }

  async updateSiteManagerData(req, res) {
    try {
      const { id } = req.params;
      const roleChecker = new RoleChecker(req);
      const role = await roleChecker.getRole();
      const userIdHelper = new GetUserId(req);
      const userId = await userIdHelper.getUserId();

      if (role !== "admin") {
        return res.status(500).json({ message: "Unauthorized" });
      }
      const logoFilename = req.file ? `/uploads/${req.file.filename}` : null;
      const response = await siteService.updateSiteManagerData(
        id,
        req.body,
        userId,
        logoFilename
      );

      res.status(response.status).json(response.data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new SiteController();
