const jwt = require('jsonwebtoken');

const JWT_SECRET = require('../config/jwt');

function generateToken(user){
    const payload = {
        id: user._id,
        email: user.email,
    };
    return jwt.sign(payload, JWT_SECRET, {expiresIn:'1h'});

};

function generateRefreshToken(user){
    const payload = {
        id: user._id,
        email: user.email,
    };
    return jwt.sign(payload, JWT_SECRET, {expiresIn:'7d'});
}

function verifyToken(token){
    return jwt.verify(token, JWT_SECRET);
};

module.exports = {generateToken, generateRefreshToken, verifyToken};