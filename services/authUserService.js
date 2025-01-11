// const { sendMail } = require("../helper/sendMail");
const User = require("../models/users");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

class AuthService {
  generatePassword() {
    return crypto.randomBytes(4).toString("hex");
  }

  async createEmployee(userData) {
    const {
      name,
      email,
      country,
      phone,
      state,
      city,
      postalCode,
      addressLine1,
      addressLine2,
      designation,
      salary,
    } = userData;

    const password = this.generatePassword();
    console.log(password);

    let isAdmin = false;
    let isHr = false;
    let isMarketing = false;
    let isStaff = false;

    if (designation === "admin") {
      isAdmin = true;
    } else if (designation === "hr") {
      isHr = true;
    } else if (designation === "mm") {
      isMarketing = true;
    } else if (designation === "staff") {
      isStaff = true;
    }

    const newUser = new User({
      name,
      email,
      phoneNumber: phone,
      shippingAddresses: [
        {
          fullName: name,
          addressLine1,
          addressLine2,
          city,
          state,
          postalCode,
          country,
          isDefault: true,
        },
      ],
      employee: {
        designation,
        salary,
      },
      password,
      isAdmin,
      isHr,
      isMarketing,
      isStaff,
      isActive: true,
    });

    try {
      const savedUser = await newUser.save();
      return savedUser;
    } catch (error) {
      throw new Error("Error saving user: " + error.message);
    }
  }

  async addHr(userData) {
    const { name, email } = userData;
    const hashedPassword = await bcrypt.hash("admin", 10);

    const newHr = new User({
      name,
      email,
      password: hashedPassword,
      isHr: true,
      isUser: false,
    });

    try {
      const savedUser = await newHr.save();
      //   sendMail(email, `Welcome ${name}`, `Hello ${name}`);
      return savedUser;
    } catch (err) {
      if (err.code === 11000) {
        throw new Error("Email already exists");
      }
      throw new Error(err.message);
    }
  }

  async getHr() {
    try {
      const hrUsers = await User.find({ isHr: true }).select(
        "name email phoneNumber profileImg createdAt lastUpdate"
      );

      if (hrUsers.length === 0) {
        return [];
      }

      return hrUsers;
    } catch (err) {
      throw new Error("Failed to fetch HR users: " + err.message);
    }
  }

  async addM(userData) {
    const { name, email } = userData;

    const hashedPassword = await bcrypt.hash("admin", 10);

    const newMarketing = new User({
      name,
      email,
      password: hashedPassword,
      isMarketing: true,
      isUser: false,
    });
    try {
      const savedUser = await newMarketing.save();
      //   sendMail(email, `Welcome ${name}`, `Hello ${name}`);
      return savedUser;
    } catch (err) {
      if (err.code === 11000) {
        throw new Error("Email already exists");
      }
      throw new Error(err.message);
    }
  }

  async getMarketingManager() {
    try {
      const marketingManager = await User.find({ isMarketing: true }).select(
        "name email phoneNumber profileImg createdAt lastUpdate"
      );

      if (marketingManager.length === 0) {
        return [];
      }

      return marketingManager;
    } catch (err) {
      throw new Error("Failed to fetch Marketing Managers: " + err.message);
    }
  }

  async addStaff(userData) {
    const { name, email } = userData;

    const hashedPassword = await bcrypt.hash("admin", 10);

    const newStaff = new User({
      name,
      email,
      password: hashedPassword,
      isStaff: true,
      isUser: false,
    });
    try {
      const savedUser = await newStaff.save();
      //   sendMail(email, `Welcome ${name}`, `Hello ${name}`);
      return savedUser;
    } catch (err) {
      if (err.code === 11000) {
        throw new Error("Email already exists");
      }
      throw new Error(err.message);
    }
  }

  async getStaffs() {
    try {
      const staffs = await User.find({ isStaff: true }).select(
        "name email phoneNumber profileImg createdAt lastUpdate"
      );

      if (staffs.length === 0) {
        return [];
      }

      return staffs;
    } catch (err) {
      throw new Error("Failed to fetch Staff members: " + err.message);
    }
  }
}

module.exports = new AuthService();
