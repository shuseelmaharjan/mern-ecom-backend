const jwt = require("jsonwebtoken");

class TokenValidator {
  constructor(token) {
    this.token = token;
    this.user = null;
  }

  verifyToken() {
    try {
      const decoded = jwt.verify(this.token, process.env.ACCESS_TOKEN_SECRET);

      if (!decoded.UserInfo || !decoded.UserInfo.role) {
        throw new Error("Invalid token payload");
      }
      this.user = decoded.UserInfo;
      return true;
    } catch (err) {
      throw new Error("Invalid or expired access token");
    }
  }

  isAdmin() {
    if (this.user.role !== "admin") {
      throw new Error("The user is not an admin");
    }
    return true;
  }

  isUser() {
    if (this.user.role !== "user") {
      throw new Error("The user is not a user");
    }
    return true;
  }

  isVendor() {
    if (this.user.role !== "vendor") {
      throw new Error("The user is not a vendor");
    }
    return true;
  }

  isStaff() {
    if (this.user.role !== "staff") {
      throw new Error("The user is not a staff member");
    }
    return true;
  }

  isHr() {
    if (this.user.role !== "hr") {
      throw new Error("The user is not a hr member");
    }
    return true;
  }
}

// Helper function to extract token from headers
const extractTokenFromHeaders = (headers) => {
  const authHeader = headers.authorization || headers.Authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    return token;
  }
  return null;
};

// Middleware to verify the access token
const verifyAccessToken = (req, res, next) => {
  const token = extractTokenFromHeaders(req.headers);

  if (!token) {
    console.log("Access token not provided.");
    return res.status(403).json({ message: "Access token required" });
  }

  const tokenValidator = new TokenValidator(token);

  try {
    tokenValidator.verifyToken();
    // console.log("User Info from Token:", tokenValidator.user);
    req.user = tokenValidator.user;
    next();
  } catch (err) {
    console.log("Token verification failed:", err.message);
    return res.status(401).json({ message: err.message });
  }
};

// Middleware to verify roles
const verifyRole = (roleCheckFunction) => {
  return (req, res, next) => {
    const token = extractTokenFromHeaders(req.headers);

    if (!token) {
      console.log("Access token not provided for role check.");
      return res.status(403).json({ message: "Access token required" });
    }

    const tokenValidator = new TokenValidator(token);

    try {
      tokenValidator.verifyToken();
      roleCheckFunction.call(tokenValidator);
      // console.log("Role verified for user:", tokenValidator.user.role);
      req.user = tokenValidator.user;
      next();
    } catch (err) {
      console.log("Role verification failed:", err.message);
      return res.status(403).json({ message: err.message });
    }
  };
};

// Define specific role-based middlewares
const verifyAdmin = verifyRole(TokenValidator.prototype.isAdmin);
const verifyUser = verifyRole(TokenValidator.prototype.isUser);
const verifyVendor = verifyRole(TokenValidator.prototype.isVendor);
const verifyStaff = verifyRole(TokenValidator.prototype.isStaff);
const verifyHr = verifyRole(TokenValidator.prototype.isHr);

// Middleware to verify multiple roles
const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const token = extractTokenFromHeaders(req.headers);

    if (!token) {
      console.log("Access token not provided for role verification.");
      return res.status(403).json({ message: "Access token required" });
    }

    const tokenValidator = new TokenValidator(token);

    try {
      tokenValidator.verifyToken();

      if (!allowedRoles.includes(tokenValidator.user.role)) {
        // console.log(
        //   "User does not have required role. User role:",
        //   tokenValidator.user.role
        // );
        return res
          .status(403)
          .json({ message: "You do not have the required role" });
      }

      // console.log("User authorized with role:", tokenValidator.user.role);
      req.user = tokenValidator.user;
      next();
    } catch (err) {
      console.log("Token verification failed:", err.message);
      return res.status(401).json({ message: err.message });
    }
  };
};

module.exports = {
  verifyAccessToken,
  verifyAdmin,
  verifyUser,
  verifyVendor,
  verifyStaff,
  verifyHr,
  verifyRoles,
};
