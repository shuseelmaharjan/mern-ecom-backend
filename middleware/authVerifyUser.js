const jwt = require('jsonwebtoken');

// Middleware to verify the access token
const verifyAccessToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];  
    if (!token) {
        return res.status(403).json({ message: 'Access token required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded.UserInfo; 
        next();  
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired access token' });
    }
};

const verifyUserRole = (req, res, next) => {
    if (req.user.role !== 'user') {
        return res.status(403).json({ message: 'Only users can upgrade to vendor role' });
    }
    next();  
};

const verifyVendorRole = (req, res, next) => {    
    if (req.user.role !== 'vendor') {
        return res.status(403).json({ message: 'Only vendor are allowed to upgrade their shop profile' });
    }
    next();  
};


module.exports = { verifyAccessToken, verifyUserRole, verifyVendorRole};
