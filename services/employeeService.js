const User = require("../models/users");

class EmployeeService {
  static async getActiveEmployees() {
    try {
      const employees = await User.find({
        isActive: true,
        isUser: { $in: [false, null] },
        isVendor: { $in: [false, null] },
      }).select(
        "name email phoneNumber profileImg createdAt isAdmin isHr isMarketing isStaff"
      );

      return employees.map((employee) => {
        let designation = "";
        if (employee.isAdmin) designation = "admin";
        else if (employee.isMarketing) designation = "mm";
        else if (employee.isHr) designation = "hr";
        else if (employee.isStaff) designation = "staff";

        return {
          id: employee.id,
          name: employee.name,
          email: employee.email,
          phone: employee.phoneNumber,
          profileImg: employee.profileImg,
          joinedDate: employee.createdAt,
          designation,
        };
      });
    } catch (error) {
      throw new Error("Failed to fetch employees: " + error.message);
    }
  }

  static async getActiveStaffs() {
    try {
      const employees = await User.find({
        isActive: true,
        isUser: { $in: [false, null] },
        isVendor: { $in: [false, null] },
        isHr: { $in: [false, null] },
        isAdmin: { $in: [false, null] },
      }).select(
        "name email phoneNumber profileImg createdAt isAdmin isHr isMarketing isStaff"
      );

      return employees.map((employee) => {
        let designation = "";
        if (employee.isMarketing) designation = "mm";
        else if (employee.isStaff) designation = "staff";

        return {
          id: employee.id,
          name: employee.name,
          email: employee.email,
          phone: employee.phoneNumber,
          profileImg: employee.profileImg,
          createdAt: employee.createdAt,
          designation,
        };
      });
    } catch (error) {
      throw new Error("Failed to fetch employees: " + error.message);
    }
  }

  static async deactivateUser(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    user.isActive = false;
    await user.save();
    return user;
  }
}

module.exports = EmployeeService;
