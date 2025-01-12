const EmployeeService = require("../services/employeeService");

class EmployeeController {
  static async getActiveEmployees(req, res) {
    try {
      const employees = await EmployeeService.getActiveEmployees();
      res.status(200).json(employees);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getActiveStaffs(req, res) {
    try {
      const staffs = await EmployeeService.getActiveStaffs();
      res.status(200).json(staffs);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async deactivateUser(req, res) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      await EmployeeService.deactivateUser(userId);

      return res.status(200).json({
        message: "User deactivated successfully",
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

module.exports = EmployeeController;
