const { sendMail } = require("../helper/sendMail");
const User = require("../models/users");

class AuthService {
  async addUser(userData) {
    const { name, email, password, isHr, isMarketing, isStaff } = userData;

    const newUser = new User({
      name,
      email,
      password,
      isHr: !!isHr,
      isMarketing: !!isMarketing,
      isStaff: !!isStaff,
      isUser: !isHr,
    });

    try {
      const savedUser = await newUser.save();
      sendMail(email, `Welcome ${name}`, `Hello ${name}`);
      return savedUser;
    } catch (err) {
      if (err.code === 11000) {
        throw new Error("Email already exists");
      }
      throw new Error(err.message);
    }
  }
}

module.exports = new AuthService();
