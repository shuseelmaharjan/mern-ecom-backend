const User = require('../models/User')
const bcrypt = require('bcrypt')
const rest = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

// @desc Signup
// @route POST /api/v1/signup
// @access Public
const signup = asyncHandler(async(req, res) => {
    try{
            const { email, password} = req.body;
            const hashPassword = await bcrypt.hash(password, 10);
            const newUser = new User({
                email, 
                password: hashPassword,
    
            });
            const saveUser = await newUser.save();
    
            res.status(200).json({message:'User created successfully.', user:saveUser});
        }catch(error){
            res.status(400).json({error:'Something went wrong.', error:error.errorResponse.errmsg});
        }
})


// @desc Login
// @route POST /api/v1/login
// @access Public
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required!' });
    }

    const foundUser = await User.findOne({ email }).exec();
    if (!foundUser) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) return res.status(401).json({ message: 'Unauthorized' });

    // Determine the role
    let role = '';
    if (foundUser.isAdmin) {
        role = 'admin';
    } else if (foundUser.isVendor) {
        role = 'vendor';
    } else if (foundUser.isUser) {
        role = 'user';
    } else if (foundUser.isStaff) {
        role = 'staff';
    }

    // Create accessToken and refreshToken with role
    const accessToken = rest.sign(
        {
            "UserInfo": {
                "email": foundUser.email,
                "id": foundUser._id,
                "role": role
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1hr' }
    );

    const refreshToken = rest.sign(
        {
            "email": foundUser.email,
            "role": role
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    );

    // Set a persistent cookie with refreshToken
    res.cookie('rest', refreshToken, {
        httpOnly: true,
        secure: false, // Use true in production
        sameSite: 'Lax', // Required for cross-origin requests
        maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
    });

    // Send accessToken containing email and role
    res.json({ accessToken });
});


// @desc Refresh
// @route GET /api/v1/refresh
// @access Public - because access token has expired
const refresh = (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.rest) return res.status(401).json({ message: 'Cookie not found' });

    const refreshToken = cookie.rest;

    rest.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        asyncHandler(async (err, decode) => {
            if (err) return res.status(403).json({ message: 'Forbidden' });

            const foundUser = await User.findOne({ email: decode.email }).exec();
            if (!foundUser) return res.status(401).json({ message: 'Unauthorized' });

            // Determine the role
            let role = '';
            if (foundUser.isAdmin) {
                role = 'admin';
            } else if (foundUser.isVendor) {
                role = 'vendor';
            } else if (foundUser.isUser) {
                role = 'user';
            } else if (foundUser.isStaff) {
                role = 'staff';
            }

            // Generate new accessToken with role
            const accessToken = rest.sign(
                {
                    "UserInfo": {
                        "email": foundUser.email,
                        "id": foundUser._id,
                        "role": role
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1hr' }
            );

            res.json({ accessToken });
        })
    );
};

// @desc Refresh
// @route GET /api/v2/refresh
// @access Public - second api to get new accessToken with refreshToken only in header
const refreshToken = (req, res) => {
    // Get the Bearer token from the Authorization header
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ message: 'Authorization token missing' });

    const token = authHeader.split(' ')[1];  // Extract the token from "Bearer <token>"
    if (!token) return res.status(401).json({ message: 'Invalid Authorization header format' });

    // Verify the token using the REFRESH_TOKEN_SECRET
    rest.verify(token, process.env.REFRESH_TOKEN_SECRET, asyncHandler(async (err, decode) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden' });  // Invalid token
        }

        // Find the user by email decoded from the refresh token
        const foundUser = await User.findOne({ email: decode.email });
        if (!foundUser) {
            return res.status(401).json({ message: 'Unauthorized' });  // User not found
        }

        // Generate a new access token
        const accessToken = rest.sign(
            {
                "UserInfo": {
                    "email": foundUser.email,
                    "id": foundUser._id,
                },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1hr' }  // Access token expiration time (can adjust as needed)
        );

        // Send the new access token in the response
        res.json({ accessToken });
    }));
}


// @desc Logout
// @route GET /api/v1/logout
// @access Public - just to clear cookie if exists
const logout = (req, res) => {
    console.log(req.cookies);

    const cookie = req.cookies;
    if (!cookie?.rest) return res.sendStatus(204); 

    console.log('Clearing cookie');
    res.clearCookie('rest', {
        httpOnly: true,
        secure: false, // Matches the secure setting from login
        sameSite: 'Lax', // Matches the sameSite setting from login
        path: '/', // Ensure path is explicitly specified if needed
    });
    res.json({ message: 'Cookie cleared successfully' });
};


// @desc Check accessToken Validity
// @route GET api/v1/check-token
// @access Public - just to check token validation
const checkTokenValidity = (req, res) => {
    const cookieToken = req.cookies?.rest;
    if (!cookieToken) {
        return res.status(401).json({ message: 'Cookie token not provided' });
    }

    // Retrieve the accessToken from the Authorization header
    const headerToken = req.headers.authorization?.split(' ')[1];
    if (!headerToken) {
        return res.status(401).json({ message: 'Bearer token not provided in headers' });
    }

    try {
        // Verify the cookie token using the refresh token secret
        rest.verify(cookieToken, process.env.REFRESH_TOKEN_SECRET);

        // Verify the header token using the access token secret
        const decoded = rest.verify(headerToken, process.env.ACCESS_TOKEN_SECRET);

        // Convert activation time to ISO string
        const activationTime = new Date(decoded.iat * 1000);
        res.json({
            activationTime: activationTime.toISOString(),
            valid: true,
        });
    } catch (error) {
        res.status(403).json({ message: 'Token is invalid or expired', valid: false });
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
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: 'User updated successfully',
            data: updatedUser,
        });
    } catch (error) {
        res.status(500).json({
            message: 'An error occurred while updating the user',
            error: error.message,
        });
    }
};


const updateUserRoleFromUserToVendor = async (req, res) => {
    try {
        const userId = req.user.id;  

        const userToUpdate = await User.findById(userId);
        if (!userToUpdate) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (!userToUpdate.isUser) {
            return res.status(400).json({ success: false, message: 'User must be of type "user" to be upgraded to "vendor"' });
        }

       
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { 
                isVendor: true,
                isUser: false,
                lastUpdate: new Date()
            },
            { new: true } 
        );

        res.status(200).json({ success: true, message: 'User role updated successfully'});
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};






module.exports = {
    signup,
    login,
    refresh,
    logout,
    checkTokenValidity,
    refreshToken,
    updateUserDetails,
    updateUserRoleFromUserToVendor,
}