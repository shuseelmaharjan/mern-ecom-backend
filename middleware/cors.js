const cors = require('cors');

const corsOptions = {
  origin: 'http://localhost:3000', // Frontend URL
  credentials: true,              // Allow cookies to be included
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
};

module.exports = { cors, corsOptions };
