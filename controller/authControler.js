const User = require('../models/User')
const bcrypt = require('bcrypt')
const xhr = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

// @desc Signup
// @route POST /api/v1/signup
// @access Public
const signup = asyncHandler(async(req, res) => {
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
})


// @desc Login
// @route POST /api/v1/login
// @access Public
const login = asyncHandler(async(req, res)=> {
    const {email, password} = req.body

    console.log("password: ", password)

    if(!email || !password){
        return res.status(400).json({message:'All fields are required!'})
    }

    const foundUser = await User.findOne({email}).exec()
    console.log("Found User:", foundUser)

    if(!foundUser){
        return res.status(401).json({message: 'Unauthorized'})
    }

    const match = await bcrypt.compare(password, foundUser.password)

    if(!match) return res.status(401).json({message:'Unauthorized'})
    
    console.log("Match Password:", match)


    const accessToken = xhr.sign(
        {
            "UserInfo":{
                "email": foundUser.email,
                "id":foundUser._id
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:'1hr'}

    )

    const refreshToken = xhr.sign(
        {"email":foundUser.email},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn:'1d'}
    )

    //create secure cookie with refresh token
    res.cookie('xhr', refreshToken,{
        httpOnly:true, //accessable only by web server
        secure:false, //https
        sameSite: 'None', //cross-site cookie
        maxAge: 7*24*60*60*1000 //cookie expiry: set to match refresh token
    })

    //send accessToken containing email
    res.json({accessToken})
    

})

// @desc Refresh
// @route GET /api/v1/refresh
// @access Public - because access token has expired
const refresh = (req, res) => {
    const cookie = req.cookies;
    console.log(cookie)
    if (!cookie?.xhr) return res.status(401).json({ message: 'Cookie not found' });
    
    
    const refreshToken = cookie.xhr

    xhr.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        asyncHandler(async (err, decode) => {
            if(err) return res.status(403).json({message: 'Forbidden'})
                
            const foundUser = await User.findOne({email: decode.email})

            if(!foundUser) return res.status(401).json({message:'Unauthorized'})

            const accessToken = xhr.sign(
                {
                    "UserInfo":{
                        "email": foundUser.email,
                        "id": foundUser._id
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn:'10s'}
            )
            res.json({accessToken})
        })
    )

}


// @desc Logout
// @route GET /api/v1/logout
// @access Public - just to clear cookie if exists
const logout = (req, res) => {
    console.log(req.cookies)

    const cookie = req.cookies
    if(!cookie?.xhr) return res.sendStatus(204) //no content
    res.clearCookie('xhr', {httpOnly:true, sameSite:'None', secure:false})
    res.json({message:'Cookie cleared'})

}


module.exports = {
    signup,
    login,
    refresh,
    logout
}