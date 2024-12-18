const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const cookieParser = require('cookie-parser');


dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());


// Logging middleware to log every request
app.use((req, res, next) => {
    const { method, url } = req;
    console.log(`[${new Date().toISOString()}] ${method} request to ${url}`);
    next();  // Call the next middleware or route handler
});

const authRoute = require('./routes/authRoutes')

app.use('/api', authRoute)

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


app.get('/', (req, res) => {
    res.send('Hello, World!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server is running on port ${PORT}`));