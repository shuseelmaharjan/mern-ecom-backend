const SiteManager = require("../models/Site");

class SiteService {
  async insert(data) {
    await SiteManager.ensureSingleDocument(); 
    const newSite = new SiteManager(data);
    return newSite.save();
  }

  async update(data) {
    const updatedDocument = await SiteManager.findOneAndUpdate(
      {},
      data,
      { new: true, runValidators: true }
    );

    if (!updatedDocument) {
      throw new Error("No document found to update.");
    }

    return updatedDocument;
  }

  async getAll() {
    const data = await SiteManager.find();  
    return data;
  }
}

module.exports = new SiteService();
