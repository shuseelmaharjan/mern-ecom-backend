const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if(!token){
        return res.status(401).json({message: 'Authorization token required'});
    }
    try{
        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decode;
        next();
    }catch(error){
        console.error(error);
        return res.status(401).json({message: 'Invalid token'});
    }
};

module.exports = {authMiddleware};