const bcrypt = require('bcryptjs');
const User = require('../models/Users');

const registerUser = async ({name, email, password}) => {
    try{
        const userExist = await User.findOne({email});
        if(userExist){
            return{error: true, message:"User already exist"};
        }

        //Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const user = new User({name, email, password: hashPassword});

        await user.save();
        return{error:false};
    }catch(error){
        throw new Error('Error registering user:' + error.message);
    }
}

const getAllUsers = async() => {
    try{
        const users = await User.find();
        return users;
    }catch(error){
        throw new Error('Error fetching users' + error.message);
    }
};

module.exports = {
    registerUser,
    getAllUsers,
}