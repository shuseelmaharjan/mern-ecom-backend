const jwt = require("jsonwebtoken");
const User = require("../models/users");

class RoleChecker {
  constructor(req) {
    this.req = req;
  }

  getToken() {
    const authHeader = this.req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("Unauthorized");
    }
    return authHeader.split(" ")[1];
  }

  decodeToken() {
    const token = this.getToken();
    try {
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      return decodedToken.UserInfo;
    } catch (err) {
      throw new Error("Invalid token");
    }
  }

  async getRole() {
    const userInfo = this.decodeToken();
    return userInfo.role;
  }
}

module.exports = RoleChecker;
