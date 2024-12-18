const express = require('express');

const {signupUser} = require('../controllers/userSignup');

const router = express.Router();

router.post('/v1/signup', signupUser);

module.exports = router;

