// const userService = require('../service/userService');


// const registerUser = async(req, res) => {
//     try{
//         const{ name, email, password } = req.body;

//         const result = await userService.registerUser({name, email, password});

//         if(result.error){
//             return res.status(400).json({message: result.message});
//         }
//         res.status(200).json({message:"User registered successfully"});
//     }catch(error){
//         res.status(500).json({message: error.message});
//     }
// };

// const getUsers = async (req, res) => {
//     try {
//         const users = await userService.getAllUsers();
//         res.status(200).json(users);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };




// module.exports = {
//     getUsers,
//     registerUser,
// };