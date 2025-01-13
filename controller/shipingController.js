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

  async updateShippingAddress(req, res) {
    try {
      const id = new GetUserId(req);
      const userId = await id.getUserId();
      const { shippingAddressId } = req.params;
      const updateData = req.body;
      console.log(userId);

      console.log("Request body:", updateData);
      console.log("Request params:", req.params);

      const updatedUser = await ShippingService.updateShippingAddress(
        userId,
        shippingAddressId,
        updateData
      );

      res.status(200).json({
        message: "Shipping address updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getShippingAddress(req, res) {
    try {
      const id = new GetUserId(req);
      const userId = await id.getUserId();
      const { shippingAddressId } = req.params;

      const shippingAddress =
        await ShippingService.getIndividualShippingAddress(
          userId,
          shippingAddressId
        );

      res.status(200).json({
        message: "Shipping address fetched successfully",
        data: shippingAddress,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateDefaultShippingAddress(req, res) {
    try {
      const id = new GetUserId(req);
      const userId = await id.getUserId();
      const { shippingId } = req.params;

      if (!shippingId) {
        return res.status(400).json({ error: "Shipping ID is required." });
      }

      const updatedAddress = await ShippingService.updateDefaultShippingAddress(
        userId,
        shippingId
      );

      res.status(200).json({
        message: "Default shipping address updated successfully.",
        data: updatedAddress,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateDefaultBillingAddress(req, res) {
    try {
      const id = new GetUserId(req);
      const userId = await id.getUserId();
      const { shippingId } = req.params;

      if (!shippingId) {
        return res.status(400).json({ error: "Shipping ID is required." });
      }

      const updatedAddress = await ShippingService.updateDefaultBillingAddress(
        userId,
        shippingId
      );

      res.status(200).json({
        message: "Default billing address updated successfully.",
        data: updatedAddress,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new UserShippingController();
