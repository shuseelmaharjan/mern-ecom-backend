const express = require('express');
const router = express.Router();
const User = require('../models/Users');
const userController = require('../controllers/userController');

// Route for user registration
router.post('/v1/register', userController.registerUser);

// Route to fetch all users
router.get('/users', userController.getUsers);

module.exports = router;
