const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// import routes
// const userRouters = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userSignup');
const loginUserRoutes = require('./routes/loginUserRoutes');




// use routes
app.use('/api', userRoutes);
app.use('/api', loginUserRoutes);
// app.use('/api/auth', authRoutes);


// console.log("authRoutes:", authRoutes);
console.log("userRoutes:", userRoutes);
console.log("loginRoutes:", loginUserRoutes);



app.get('/', (req, res) => {
    res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server is running on port ${PORT}`));


