const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('./middleware/cors');

dotenv.config();
connectDB();

const app = express();
app.options('*', cors());  

// Use CORS middleware before all routes
app.use(cors());  // This must be before your route handling

app.use(express.json());

// Define routes
const userRoutes = require('./routes/userSignup');
const loginUserRoutes = require('./routes/loginUserRoutes');

app.use('/api', userRoutes);
app.use('/api', loginUserRoutes);

app.get('/', (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server is running on port ${PORT}`));
