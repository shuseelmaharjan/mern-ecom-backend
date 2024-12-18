const bcrypt = require('bcrypt');

const user = require('../models/Users');

const {generateToken, verifyToken, generateRefreshToken} = require("../utils/auth");


async function userLogin(req, res) {
    try{
        const {email, password} = req.body;
        const userExist = await user.findOne({email});

        if(!userExist){
            throw new Error('User not found');
        }

        const isMatch = await bcrypt.compare(password, userExist.password);
        if(!isMatch){
            throw new Error("Invalid Credientials");
        }

        const token = generateToken(userExist);
        res.status(200).json({user:userExist, token:token});
    }catch(err){
        res.status(400).json({message: "Invalid credientials"});
    }
    
}

async function refreshToken(req, res){
    try{
        const {oldToken } = req.body;
        const decodeToken = verifyToken(oldToken);
        const userExist = user.findById(decodeToken.id);

        if(!userExist){
            throw new Error("User not found");
        }

        const newToken = generateRefreshToken(userExist);
        res.status(200).json({token: newToken});
    }catch(error){
        console.error(error);
        res.status(500).json({message:"Failed to refresh token"});
    }



}

module.exports = {userLogin, refreshToken };