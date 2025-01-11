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
}

module.exports = new UserController();
