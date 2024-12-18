// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const User = require('../models/Users'); 

// const { validationResult } = require('express-validator');

// const loginUser = async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     const { email, password } = req.body;

//     try {
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(400).json({ message: 'Invalid email or password' });
//         }

//         // Compare the password with the hashed password in the database
//         const match = await bcrypt.compare(password, user.password);
//         if (!match) {
//             return res.status(400).json({ message: 'Invalid email or password' });
//         }

//         const payload = {
//             userId: user._id,
//         };

//         // Generate a JWT token
//         const access_token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1m' });
//         const refresh_token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

//         console.log('JWT_SECRET:', process.env.JWT_SECRET);

//         res.status(200).json({
//             message: 'Login successful',
//             access_token,
//             refresh_token,
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server error' });
//     }
// };

// const getUserData = async(req, res) => {
//     const authHeader = req.headers.authorization;

//     if(!authHeader || !authHeader.startsWith('Bearer ')){
//         return res.status(401).json({message:'Authorization token missing or invalid'});
//     }

//     const token = authHeader.split(' ')[1];

//     try{
//         const decode = jwt.verify(token, process.env.JWT_SECRET);

//         if (decoded.exp < Date.now() / 1000) {
//             return res.status(401).json({ message: 'Access token has expired' });
//         }

//         const user = await User.findById(decode.userId).select('-password');


//         if(!user){
//             return res.status(404).json({message:"User not found"});
//         }

//         res.status(200).json({
//             message:'User information retrived successfully',
//             user,
//         });
//     }catch(error){
//         console.error(error);
//         res.status(401).json({message:'Invalid or expired token'});
//     }
// };

// module.exports = { loginUser, getUserData };
