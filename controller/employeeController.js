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
}

module.exports = EmployeeController;
