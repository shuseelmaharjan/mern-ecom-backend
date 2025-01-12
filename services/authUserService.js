// const { sendMail } = require("../helper/sendMail");
const User = require("../models/users");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const mongoose = require("mongoose");

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

    const newPassword = this.generatePassword();
    console.log(newPassword);
    const password = await bcrypt.hash(newPassword, 10);

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
      shippingAddresses: [
        {
          fullName: name,
          addressLine1,
          addressLine2,
          city,
          phone,
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

  async findUserById(userId) {
    try {
      return await User.findById(userId);
    } catch (error) {
      throw new Error("Error finding user: " + error.message);
    }
  }

  async updateUserDetails(user, updates) {
    try {
      user.name = updates.name;
      user.email = updates.email;
      user.phoneNumber = updates.phone;

      // Designation updates
      const designation = updates.designation;
      user.isAdmin = designation === "admin";
      user.isHr = designation === "hr";
      user.isMarketing = designation === "mm";
      user.isStaff = designation === "staff";

      // Update default address if exists
      const defaultAddress = user.shippingAddresses.find(
        (address) => address.isDefault
      );

      if (defaultAddress) {
        defaultAddress.fullName = updates.name;
        defaultAddress.addressLine1 = updates.addressLine1;
        defaultAddress.addressLine2 = updates.addressLine2 || null;
        defaultAddress.city = updates.city;
        defaultAddress.state = updates.state;
        defaultAddress.postalCode = updates.postalCode;
        defaultAddress.country = updates.country;
      }

      if (user.employee) {
        user.employee.designation = updates.designation;
        user.employee.salary = updates.salary;
      }

      return await user.save();
    } catch (error) {
      throw new Error("Error updating user: " + error.message);
    }
  }

  async getUserDetails(userId) {
    try {
      const user = await User.findById(userId).select("-password").lean();

      if (!user) {
        throw new Error("User not found");
      }

      let role = null;
      if (user.isAdmin) role = "admin";
      else if (user.isVendor) role = "vendor";
      else if (user.isUser) role = "user";
      else if (user.isHr) role = "hr";
      else if (user.isMarketing) role = "mm";
      else if (user.isStaff) role = "staff";

      return {
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role,
        shippingAddresses: user.shippingAddresses,
        employee: user.employee,
        emergencyContact: user.emergencyContact,
      };
    } catch (error) {
      throw new Error(error.message);
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
  async settingProfile(userId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid user ID format");
      }

      const data = await User.findById(userId, {
        name: 1,
        email: 1,
        phoneNumber: 1,
        profileImg: 1,
        createdAt: 1,
        verified: 1,
        emergencyContact: 1,
        gender: 1,
        shippingAddresses: 1,
      });

      if (!data) {
        throw new Error("User not found");
      }

      const defaultAddress = data.shippingAddresses.find(
        (address) => address.isDefault
      );

      return {
        ...data.toObject(),
        defaultAddress: defaultAddress || null,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateUserProfileImage(userId, imagePath) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found.");
    }
    user.profileImg = imagePath;
    await user.save();
    return user.profileImg;
  }

  async updateUserNmae(userId, name) {
    if (!name) {
      throw new Error("Name is required");
    }
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { name },
        { new: true }
      );

      if (!user) {
        throw new Error("User not found");
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  async updateUserEmail(userId, email) {
    if (!email) {
      throw new Error("Email is required");
    }
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { email },
        { new: true }
      );

      if (!user) {
        throw new Error("User not found");
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  async changePassword(userId, oldPassword, newPassword) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found.");
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new Error("Old password is incorrect.");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.lastUpdate = new Date();
    await user.save();

    return "Password updated successfully.";
  }
}

module.exports = new AuthService();
