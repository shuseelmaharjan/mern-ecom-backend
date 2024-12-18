const rateLimit = require('express-rate-limit')
const {logEvents} = require('../utils/logger')


const loginLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // limit each IP to 5 login requests per window per minute
    message: { message: 'Too many requests. Please try again later' },
    handler: (req, res, next, options) => {
        logEvents(
            `message: 'Too many requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
            'errLog.log'
        );
        res.status(options.statusCode).send(options.message);
    },
    standardHeaders: true,
    legacyHeaders: false,
});


module.exports = loginLimiter