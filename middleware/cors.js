const cors = require('cors');

const corsOptions = {
  origin: 'http://localhost:3000', // Make sure the origin is explicitly set to your frontend's URL
  credentials: true,  // Allow cookies to be included in requests
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these HTTP methods for preflight requests
};

module.exports = cors(corsOptions);
