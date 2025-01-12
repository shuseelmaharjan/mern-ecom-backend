const userService = require("../services/authUserService");
const RoleChecker = require("../helper/roleChecker");

class UserController {
  async createEmployee(req, res) {
    const {
      name,
      email,
      phone,
      state,
      city,
      postalCode,
      addressLine1,
      addressLine2,
      designation,
      salary,
      country,
    } = req.body;

    if (
      !name ||
      !email ||
      !country ||
      !phone ||
      !state ||
      !city ||
      !postalCode ||
      !addressLine1 ||
      !designation ||
      !salary
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    try {
      const newUser = await userService.createEmployee({
        name,
        email,
        phone,
        state,
        city,
        postalCode,
        addressLine1,
        addressLine2,
        designation,
        salary,
        country,
      });

      res.status(201).json({
        message: "Employee created successfully",
        user: newUser,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Server error, please try again later." });
    }
  }

  async updateUser(req, res) {
    console.log(req.body);
    const { userId } = req.params;
    const {
      name,
      email,
      phone,
      country,
      state,
      city,
      postalCode,
      addressLine1,
      addressLine2,
      designation,
      salary,
    } = req.body;

    if (
      !name ||
      !email ||
      !phone ||
      !country ||
      !state ||
      !city ||
      !postalCode ||
      !addressLine1 ||
      !designation ||
      !salary
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    try {
      const user = await userService.findUserById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      const updates = {
        name,
        email,
        phone,
        country,
        state,
        city,
        postalCode,
        addressLine1,
        addressLine2,
        designation,
        salary,
      };

      const updatedUser = await userService.updateUserDetails(user, updates);

      res.status(200).json({
        message: "User updated successfully.",
        user: updatedUser,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Server error, please try again later." });
    }
  }

  async getUserDetails(req, res) {
    try {
      const userId = req.params.id;

      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const userDetails = await userService.getUserDetails(userId);
      return res.status(200).json(userDetails);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async addHr(req, res) {
    try {
      const roleChecker = new RoleChecker(req);
      const role = await roleChecker.getRole();

      if (role !== "admin") {
        return res.status(500).json({ message: "Unauthorized" });
      }

      const newUser = await userService.addHr(req.body);
      res.status(201).json({ message: "HR added successfully", user: newUser });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async getHrData(req, res) {
    try {
      const roleChecker = new RoleChecker(req);
      const role = await roleChecker.getRole();

      if (role !== "admin") {
        return res.status(403).json({ message: "Unauthorized: Admin only" });
      }

      const hrUsers = await userService.getHr();

      if (hrUsers.length === 0) {
        return res.status(404).json({ message: "No HR users found." });
      }

      res.status(200).json({ message: "Success", hrUsers });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async addMarketing(req, res) {
    try {
      const roleChecker = new RoleChecker(req);
      const role = await roleChecker.getRole();

      if (role === "admin" || role === "hr") {
        const newUser = await userService.addM(req.body);
        res.status(201).json({
          message: "Marketing manager added successfully",
          user: newUser,
        });
      } else {
        return res.status(500).json({ message: "Unauthorized" });
      }
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async getMarketingManagerData(req, res) {
    try {
      const roleChecker = new RoleChecker(req);
      const role = await roleChecker.getRole();

      if (role !== "admin" && role !== "hr") {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const marketingManager = await userService.getMarketingManager();

      if (marketingManager.length === 0) {
        return res
          .status(404)
          .json({ message: "No Marketing Managers found." });
      }

      res.status(200).json({ message: "Success", marketingManager });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async addStaff(req, res) {
    try {
      const roleChecker = new RoleChecker(req);
      const role = await roleChecker.getRole();

      if (role === "admin" || role === "hr") {
        const newUser = await userService.addStaff(req.body);
        res
          .status(201)
          .json({ message: "Staff addes successfuly", user: newUser });
      } else {
        return res.status(500).json({ message: "Unauthorized" });
      }
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async getStaffs(req, res) {
    try {
      const roleChecker = new RoleChecker(req);
      const role = await roleChecker.getRole();

      if (role !== "admin" && role !== "hr") {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const staffs = await userService.getStaffs();

      if (staffs.length === 0) {
        return res.status(404).json({ message: "No Staffs found." });
      }

      res.status(200).json({ message: "Success", staffs });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async settingUserInfo(req, res) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({ message: "User id is required" });
      }

      const user = await userService.settingProfile(userId);
      return res.status(200).json({ success: true, data: user });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async uploadUserImage(req, res) {
    try {
      const { userId } = req.params;

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded." });
      }

      const imagePath = req.file.path;
      const updatedImagePath = await userService.updateUserProfileImage(
        userId,
        imagePath
      );

      res.status(200).json({
        message: "Profile image uploaded successfully.",
        profileImg: updatedImagePath,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "An error occurred.", error: error.message });
    }
  }

  async updateUserNmae(req, res) {
    const { userId } = req.params;
    const { name } = req.body;
    try {
      await userService.updateUserNmae(userId, name);
      return res.status(200).json({ message: "Name updated successfully." });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async updateUserEmail(req, res) {
    const { userId } = req.params;
    const { email } = req.body;
    try {
      await userService.updateUserEmail(userId, email);
      return res.status(200).json({ message: "Email updated successfully." });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async changePassword(req, res) {
    try {
      const { oldPassword, newPassword } = req.body;
      const userId = req.user.id;

      if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: "All fields are required." });
      }

      const message = await userService.changePassword(
        userId,
        oldPassword,
        newPassword
      );
      return res.status(200).json({ message });
    } catch (error) {
      console.error("Error in changePassword:", error);
      return res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new UserController();
