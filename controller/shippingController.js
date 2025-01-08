const User = require("../models/users");

class ShippingController {
  // @desc AddShipping Address
  // @route Post /api/v1/add-shipping-address
  // @access Private - accessable with only accessToken in a bearer token
  async addShippingAddress(req, res) {
    const {
      fullName,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      isDefault,
    } = req.body;
    const userId = req.user.id;

    try {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            shippingAddresses: {
              fullName,
              addressLine1,
              addressLine2: addressLine2 || null,
              city,
              state,
              postalCode,
              country,
              isDefault,
              createdAt: new Date(),
              updatedAt: null,
            },
          },
        },
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(201).json({
        message: "Shipping address added successfully",
        data: updatedUser.shippingAddresses,
      });
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while adding the shipping address",
        error: error.message,
      });
    }
  }

  // @desc Get Shipping Address
  // @route Get /api/v1/get-shipping-address
  // @access Private - accessable with only accessToken in a bearer token
  async getShippingAddress(req, res) {
    const userId = req.user.id;

    try {
      const user = await User.findById(userId).select("shippingAddresses");

      if (!user || !user.shippingAddresses.length) {
        return res.status(404).json({
          message: "No shipping addresses found for this user.",
        });
      }

      res.status(200).json({
        message: "Shipping addresses retrieved successfully.",
        data: user.shippingAddresses,
      });
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while fetching the shipping addresses.",
        error: error.message,
      });
    }
  }

  // @desc Update Shipping Address
  // @route PUT /api/v1/update-shipping-address
  // @access Private - accessable with only accessToken in a bearer token
  async updateShippingAddress(req, res) {
    const { addressId } = req.params;
    const {
      fullName,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      isDefault,
    } = req.body;
    const userId = req.user.id;

    try {
      const updatedUser = await User.findOneAndUpdate(
        {
          _id: userId,
          "shippingAddresses._id": addressId,
        },
        {
          $set: {
            "shippingAddresses.$.fullName": fullName,
            "shippingAddresses.$.addressLine1": addressLine1,
            "shippingAddresses.$.addressLine2": addressLine2 || null,
            "shippingAddresses.$.city": city,
            "shippingAddresses.$.state": state,
            "shippingAddresses.$.postalCode": postalCode,
            "shippingAddresses.$.country": country,
            "shippingAddresses.$.isDefault": isDefault,
            "shippingAddresses.$.updatedAt": new Date(),
          },
        },
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        return res
          .status(404)
          .json({ message: "User or shipping address not found" });
      }

      res.status(200).json({
        message: "Shipping address updated successfully",
        data: updatedUser.shippingAddresses,
      });
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while updating the shipping address",
        error: error.message,
      });
    }
  }

  // @desc AddShipping Address
  // @route DELETE /api/v1/delete-shipping-address
  // @access Private - accessable with only accessToken in a bearer token
  async deleteShippingAddress(req, res) {
    const { addressId } = req.params;
    const userId = req.user.id;

    try {
      const updatedUser = await User.findOneAndUpdate(
        {
          _id: userId,
          "shippingAddresses._id": addressId,
        },
        {
          $pull: {
            shippingAddresses: { _id: addressId },
          },
        },
        { new: true }
      );

      if (!updatedUser) {
        return res
          .status(404)
          .json({ message: "User or shipping address not found" });
      }

      res.status(200).json({
        message: "Shipping address deleted successfully",
        data: updatedUser.shippingAddresses,
      });
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while deleting the shipping address",
        error: error.message,
      });
    }
  }
}

module.exports = new ShippingController();
