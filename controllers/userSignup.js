const User = require('../models/Users');

const bcrypt = require("bcrypt");

async function signupUser(req, res) {
    try{
        const { email, password} = req.body;
        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            email, 
            password: hashPassword,

        });
        const saveUser = await newUser.save();

        res.status(200).json({message:'User created successfully', user:saveUser});
    }catch(error){
        console.error(error);
        res.status(400).json({error: error.message});
    }
}

module.exports = {signupUser};