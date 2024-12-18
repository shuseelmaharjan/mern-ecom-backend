const jwt = require('jsonwebtoken');

const refreshAccessToken = (req, res) => {
    const {refresh_token} = req.body;

    if(!refresh_token){
        return res.status(400).json("Refresh Token is required");

    }

    try{
        const decode = jwt.verify(refresh_token, process.env.JWT_SECRET);

        const new_access_token = jwt.sign(
            {userId: decode.userId},
            process.env.JWT_SECRET,
            {expiresIn: "1m"}
        );

        res.status(200).json({
            message:'Access token refreshed',
            access_token : new_access_token,
        });

    }catch(error){
        console.error(error);
        res.status(401).json({message:'Invalid Refresh Token'});
    }
}

module.exports = {refreshAccessToken};