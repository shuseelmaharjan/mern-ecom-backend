const User = require("../models/users");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

// @desc Signup
// @route POST /api/v1/signup
// @access Public
const signup = asyncHandler(async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashPassword,
      isUser: true,
    });
    const saveUser = await newUser.save();

    res
      .status(200)
      .json({ message: "User created successfully.", user: saveUser });
  } catch (error) {
    res.status(400).json({
      error: "Something went wrong.",
      error: error.errorResponse.errmsg,
    });
  }
});

// @desc Login
// @route POST /api/v1/login
// @access Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  const foundUser = await User.findOne({ email }).exec();
  if (!foundUser) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const match = await bcrypt.compare(password, foundUser.password);
  if (!match) return res.status(401).json({ message: "Unauthorized" });

  let role = "";
  if (foundUser.isAdmin) {
    role = "admin";
  } else if (foundUser.isHr) {
    role = "hr";
  } else if (foundUser.isVendor) {
    role = "vendor";
  } else if (foundUser.isUser) {
    role = "user";
  } else if (foundUser.isStaff) {
    role = "staff";
  } else if (foundUser.isMarketing) {
    role = "mm";
  }

  const accessToken = jwt.sign(
    {
      UserInfo: {
        email: foundUser.email,
        id: foundUser._id,
        role: role,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1hr" }
  );

  const refreshToken = jwt.sign(
    {
      email: foundUser.email,
      name: foundUser.name,
      role: role,
      id: foundUser._id,
    },
    process.env.REFRESH_TOKEN_SECRET
  );

  res.cookie("_r", refreshToken, {
    httpOnly: false,
    secure: false,
    sameSite: "Lax",
    expires: new Date(Date.now() + 604800000),
  });

  res.json({ accessToken });
});

// @desc Refresh
// @route GET /api/v1/refresh
// @access Public - because access token has expired
const refresh = async (req, res) => {
  // Log headers and cookies for debugging
  console.log("Request Headers:", req.headers);
  console.log("Request Cookies:", req.cookies);

  const cookie = req.cookies;
  if (!cookie?._r) {
    console.error("No refresh token found in cookies");
    return res
      .status(401)
      .json({ message: "Refresh token not found in cookies" });
  }

  const refreshToken = cookie._r;

  // Verify the refresh token
  _r.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decode) => {
      if (err) {
        console.error("Token verification error:", err);
        return res
          .status(403)
          .json({ message: "Forbidden: Invalid refresh token" });
      }
      console.log("Decoded Token:", decode);

      const foundUser = await User.findOne({ email: decode.email }).exec();
      if (!foundUser) {
        console.error("User not found for email:", decode.email);
        return res
          .status(401)
          .json({ message: "Unauthorized: User not found" });
      }

      let role = "";
      if (foundUser.isAdmin) {
        role = "admin";
      } else if (foundUser.isHr) {
        role = "hr";
      } else if (foundUser.isVendor) {
        role = "vendor";
      } else if (foundUser.isUser) {
        role = "user";
      } else if (foundUser.isStaff) {
        role = "staff";
      } else if (foundUser.isMarketing) {
        role = "mm";
      }

      const accessToken = _r.sign(
        {
          UserInfo: {
            email: foundUser.email,
            id: foundUser._id,
            role: role,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1hr" }
      );

      console.log("Generated Access Token:", accessToken);
      res.json({ accessToken });
    }
  );
};

// @desc Refresh
// @route GET /api/v2/refresh
// @access Public - second api to get new accessToken with refreshToken only in header
const refreshT = async (req, res) => {
  const csrfToken = req.headers["x-csrf-token"];
  const refreshToken = req.headers["_r"];

  if (!csrfToken) {
    return res.status(401).json({ message: "CSRF token not found in headers" });
  }

  if (!refreshToken) {
    return res
      .status(401)
      .json({ message: "Refresh token not found in headers" });
  }

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decode) => {
      if (err) {
        return res
          .status(403)
          .json({ message: "Forbidden: Invalid refresh token" });
      }

      const foundUser = await User.findOne({ email: decode.email }).exec();
      if (!foundUser) {
        return res
          .status(401)
          .json({ message: "Unauthorized: User not found" });
      }

      let role = "";
      if (foundUser.isAdmin) {
        role = "admin";
      } else if (foundUser.isHr) {
        role = "hr";
      } else if (foundUser.isVendor) {
        role = "vendor";
      } else if (foundUser.isUser) {
        role = "user";
      } else if (foundUser.isStaff) {
        role = "staff";
      } else if (foundUser.isMarketing) {
        role = "mm";
      }

      const accessToken = jwt.sign(
        {
          UserInfo: {
            email: foundUser.email,
            id: foundUser._id,
            role: role,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1hr" }
      );

      res.json({ accessToken });
    }
  );
};

// @desc Logout
// @route GET /api/v1/logout
// @access Public - just to clear cookie if exists
const logout = (req, res) => {
  const cookie = req.cookies;
  if (!cookie?._r) return res.sendStatus(204);

  console.log("Clearing cookie");
  res.clearCookie("_r", {
    httpOnly: true,
    secure: false, // Matches the secure setting from login
    sameSite: "Lax", // Matches the sameSite setting from login
    path: "/", // Ensure path is explicitly specified if needed
  });
  res.json({ message: "Cookie cleared successfully" });
};

// @desc Check accessToken Validity
// @route GET api/v1/check-token
// @access Public - just to check token validation
const checkTokenValidity = (req, res) => {
  const cookieToken = req.cookies?._r;
  if (!cookieToken) {
    return res.status(401).json({ message: "Cookie token not provided" });
  }

  // Retrieve the accessToken from the Authorization header
  const headerToken = req.headers.authorization?.split(" ")[1];
  if (!headerToken) {
    return res
      .status(401)
      .json({ message: "Bearer token not provided in headers" });
  }

  try {
    // Verify the cookie token using the refresh token secret
    _r.verify(cookieToken, process.env.REFRESH_TOKEN_SECRET);

    // Verify the header token using the access token secret
    const decoded = _r.verify(headerToken, process.env.ACCESS_TOKEN_SECRET);

    // Convert activation time to ISO string
    const activationTime = new Date(decoded.iat * 1000);
    res.json({
      activationTime: activationTime.toISOString(),
      valid: true,
    });
  } catch (error) {
    res
      .status(403)
      .json({ message: "Token is invalid or expired", valid: false });
  }
};

const updateUserDetails = async (req, res) => {
  const userId = req.user.id;
  const updateData = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while updating the user",
      error: error.message,
    });
  }
};

const updateUserRoleFromUserToVendor = async (req, res) => {
  try {
    const userId = req.user.id;

    const userToUpdate = await User.findById(userId);
    if (!userToUpdate) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (!userToUpdate.isUser) {
      return res.status(400).json({
        success: false,
        message: 'User must be of type "user" to be upgraded to "vendor"',
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        isVendor: true,
        isUser: false,
        lastUpdate: new Date(),
      },
      { new: true }
    );

    res
      .status(200)
      .json({ success: true, message: "User role updated successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const userInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password -isAdmin -isUser -isVendor -isActive -isStaff -shippingAddresses"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  signup,
  login,
  refresh,
  logout,
  checkTokenValidity,
  refreshT,
  updateUserDetails,
  updateUserRoleFromUserToVendor,
  userInfo,
};
