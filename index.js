const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { cors, corsOptions } = require('./middleware/cors'); // Correct destructured import

const cookieParser = require('cookie-parser');

dotenv.config();
connectDB();

const app = express();

// Use the imported corsOptions
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

// Logging middleware to log every request
app.use((req, res, next) => {
    const { method, url } = req;
    console.log(`[${new Date().toISOString()}] ${method} request to ${url}`);
    next();  // Call the next middleware or route handler
});

const authRoute = require('./routes/authRoutes');
app.use('/api', authRoute);

const shippingRoute = require('./routes/shippingRoutes');
app.use('/api', shippingRoute);

app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(err.status || 500).json({ message: 'An error occurred', error: err.message });
});

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server is running on port ${PORT}`));
