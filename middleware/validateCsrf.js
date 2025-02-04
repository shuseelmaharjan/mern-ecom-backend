const validateCsrfToken = (req, res, next) => {
    const csrfToken = req.cookies['_csrf']; 
    const csrfHeaderToken = req.headers['x-csrf-token']; 

    if (!csrfToken) {
        return res.status(400).json({ message: 'CSRF token is missing from cookies' });
    }

    if (csrfToken !== csrfHeaderToken) {
        return res.status(403).json({ message: 'CSRF token mismatch' });
    }

    next(); 
};

module.exports = validateCsrfToken;
