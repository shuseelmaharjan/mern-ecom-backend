const SiteService = require("../services/siteService");

class SiteController {
  async insert(req, res) {
    try {
      let data = req.body;
      if (req.file) {
        data.logo = `/uploads/${req.file.filename}`;
      }

      const result = await SiteService.insert(data);
      res
        .status(201)
        .json({ message: "Data inserted successfully", data: result });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async update(req, res) {
    try {
      let data = req.body;
      if (req.file) {
        data.logo = `/uploads/${req.file.filename}`;
      }

      const result = await SiteService.update(data);
      res
        .status(200)
        .json({ message: "Data updated successfully", data: result });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const result = await SiteService.getAll();
      res
        .status(200)
        .json({ message: "Data fetched successfully", data: result });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new SiteController();
