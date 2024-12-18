const jwt = require('jsonwebtoken');
const JWT_SECRET = require('../config/jwt');

function authenticateToken(req, res, next){
    const authHeader = req.header('Authorization');

    if(!authHeader){
        return res.status(200).json({message:"No token provided"});

    }

    const [bearer, token] = authHeader.split(" ");
    if(bearer  !== "Bearer" || token === "null"){
        return res.status(200).json({message:"Invalid token provided"});
    }

    jwt.verify(token, JWT_SECRET, (error, user) => {
        if(error){
            return res.status(403).json({message:'Token is invalid'});
        }
        req.user = user;
        next();
    } )
}

module.exports = { authenticateToken};