const express = require('express');

const router = express.Router();

const {authMiddleware} = require('../middleware/authMiddleware');
const router = require('./userRoutes');

//protected route

router.get('/protected', authMiddleware, (req, res) => {
    res.status(200).json({
        message:'Access granted to protected resource',
        userId: req.user.userId,
    });
});

module.exports = router;