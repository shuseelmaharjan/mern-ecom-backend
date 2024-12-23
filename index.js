const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { cors, corsOptions } = require('./middleware/cors'); // Correct destructured import
const path = require('path');
const fs = require('fs');

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


const themeAndLogoRoute = require('./routes/themeAndLogoRoutes');
app.use('/api', themeAndLogoRoute);


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/images', express.static(path.join(__dirname, 'images')));


app.get('/image-preview', async (req, res) => {
    try {
      // Fetch the theme and logo data from the database
      const themeData = await ThemeAndLogo.findOne();
  
      if (!themeData || !themeData.logo || !themeData.logo.logoImage) {
        return res.status(404).json({ message: 'Logo image not found in the database' });
      }
  
      // The image path stored in the database (it could start with '/uploads/' or '/images/')
      const logoImagePath = themeData.logo.logoImage;
  
      // Check if the path starts with either '/uploads' or '/images' (you can add more as needed)
      if (logoImagePath.startsWith('/uploads')) {
        // If the path starts with '/uploads', use the static middleware for 'uploads' directory
        const filePath = path.join(__dirname, logoImagePath);
        
        // Check if the file exists and send it
        if (fs.existsSync(filePath)) {
          return res.sendFile(filePath);  // Send the file as a response
        } else {
          return res.status(404).json({ message: 'Image not found in the uploads folder' });
        }
      } else if (logoImagePath.startsWith('/images')) {
        // If the path starts with '/images', use the static middleware for 'images' directory
        const filePath = path.join(__dirname, logoImagePath);
        
        // Check if the file exists and send it
        if (fs.existsSync(filePath)) {
          return res.sendFile(filePath);  // Send the file as a response
        } else {
          return res.status(404).json({ message: 'Image not found in the images folder' });
        }
      } else {
        // Handle other cases, or return a 404 if the path is invalid
        return res.status(404).json({ message: 'Invalid image path in the database' });
      }
  
    } catch (error) {
      res.status(500).json({
        message: 'An error occurred while retrieving the logo image',
        error: error.message,
      });
    }
  });
  
  

app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(err.status || 500).json({ message: 'An error occurred', error: err.message });
});

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server is running on port ${PORT}`));
