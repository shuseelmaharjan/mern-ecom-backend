const ShippingService = require("../services/shippingService");
const GetUserId = require("../helper/getUserId");

class UserShippingController {
  async getShippingData(req, res) {
    try {
      const userId = new GetUserId(req);
      const id = await userId.getUserId();
      const shippingAddresses = await ShippingService.getShippingAddresses(id);

      res.status(200).json({
        message: "Shipping addresses retrieved successfully",
        shippingAddresses,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async addShippingAddress(req, res) {
    try {
      const userId = new GetUserId(req);
      const id = await userId.getUserId();
      const addressData = req.body;

      const requiredFields = [
        "fullName",
        "addressLine1",
        "city",
        "state",
        "postalCode",
        "country",
        "phone",
        "address",
      ];
      for (const field of requiredFields) {
        if (!addressData[field]) {
          return res
            .status(400)
            .json({ success: false, message: `${field} is required` });
        }
      }

      await ShippingService.addShippingAddress(id, addressData);
      res
        .status(201)
        .json({ success: true, message: "Address saved successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new UserShippingController();
