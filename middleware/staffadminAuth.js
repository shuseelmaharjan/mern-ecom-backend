const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; 
    if (!token) return res.status(403).json({ message: 'Access token required' });

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); 
        const userInfo = decoded.UserInfo;

        if (!userInfo || !['admin', 'staff', 'vendor', 'user'].includes(userInfo.role)) {
            return res.status(403).json({ message: 'Invalid role or access token' });
        }

        req.user = userInfo;

        if (['admin', 'staff'].includes(userInfo.role)) {
            next(); 
        } else {
            return res.status(403).json({ message: 'Permission denied' });
        }
    } catch (err) {
        return res.status(401).json({ message: 'Invalid access token' });
    }
};