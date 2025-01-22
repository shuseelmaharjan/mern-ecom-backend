const cors = require("cors");
require("dotenv").config();

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS"],
};

module.exports = { cors, corsOptions };
