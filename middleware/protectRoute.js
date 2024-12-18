const jwt = require('jsonwebtoken');

const protectRoute = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if(!token){
        return res.status(401).json({message:'No token, authroization denied'});
    }

    try{
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        next();
    }catch(error){
        console.error(error);
        return res.status(400).json({message: 'Invalid token'});
    }

}

module.exports = {protectRoute};