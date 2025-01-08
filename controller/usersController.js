const userService = require("../services/authUserService");

class UserController {
  async addUser(req, res) {
    try {
      const newUser = await userService.addUser(req.body);
      res
        .status(201)
        .json({ message: "User added successfully", user: newUser });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
}

module.exports = new UserController();
